import { ApiShift, ClientShift } from "../types/commonTypes";
import { configDotenv } from "dotenv";
import path from "node:path";
import {
    ConnectionOptions,
    createPool,
    ResultSetHeader,
    RowDataPacket,
} from "mysql2/promise";
import { calculateAdditionalHours } from "../src/shared/calculations/additionalHours";
import { calculateUsh } from "../src/shared/calculations/ush";
import { decimalHoursToMs } from "../src/shared/utils/conversions";
import {
    financialYear,
    flowersPayMonth,
    nextPayDate,
} from "../src/shared/calculations/payDates";
import { formatDate } from "../src/shared/utils/formatDates";

configDotenv({
    path: path.resolve(__dirname, "./../src/server/.env"),
    override: false,
});

if (!process.env.NODE_ENV) {
    // if unresolved try server path
    configDotenv({
        path: path.resolve(__dirname, "./../server/.env"),
        override: true,
    });
}

const dbOptions: ConnectionOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    namedPlaceholders: true,
    dateStrings: true,
};

const pool = createPool(dbOptions);

const executeReadByPlaceholders = async <T = RowDataPacket>(
    preparedStatement: string,
    variables: { [key: string]: string | number | null } = {}
): Promise<T[]> => {
    return (await pool.execute(preparedStatement, variables))[0] as T[];
};

const executeWriteByPlaceholders = async (
    preparedStatement: string,
    variables: { [key: string]: string | number | null } = {}
): Promise<ResultSetHeader> => {
    return (
        await pool.execute(preparedStatement, variables)
    )[0] as ResultSetHeader;
};

async function main() {
    const [oldLog] = (await pool.query(
        "SELECT `log`.*,\n       `contracts`.`id` AS `contract_id`,\n       `contracts`.`weekly_hours`\nFROM `log`\n         LEFT JOIN `contracts` ON\n    `contracts`.`employment_id` = `log`.`employment_id`\n        AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n        AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\nORDER BY `log`.`from`;"
    )) as [(ApiShift & { user_id: string })[], never];

    console.log(`Updating ${oldLog.length} shifts`);

    for (const oldShift of oldLog) {
        console.log(`Updating ${oldShift.id}`);

        const affectedShifts = await executeReadByPlaceholders<ApiShift>(
            "SELECT `log`.*, `contracts`.`weekly_hours`\nFROM `log`\n         LEFT JOIN `contracts` ON\n    `contracts`.`employment_id` = `log`.`employment_id`\n        AND (`log`.`date` >= `contracts`.`from` OR `contracts`.`from` IS NULL)\n        AND (`log`.`date` <= `contracts`.`to` OR `contracts`.`to` IS NULL)\nWHERE `log`.`user_id` = :userId\n  AND `contracts`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND `log`.`from` >= DATE_SUB(DATE(:from), INTERVAL WEEKDAY(:from) DAY)\n  AND `log`.`from` < DATE_ADD(DATE(:from), INTERVAL (7 - WEEKDAY(:from)) DAY)\nORDER BY `log`.`from`",
            {
                userId: oldShift.user_id,
                from: oldShift.from,
                employmentId: oldShift.employment_id,
            }
        );

        const additionalHours = calculateAdditionalHours(
            oldShift,
            affectedShifts
        );

        const log =
            oldShift.type === "AL (relief)" ||
            oldShift.type === "Absent (TOIL relief)"
                ? await executeReadByPlaceholders<ClientShift>(
                      "SELECT `log`.`date`, `log`.`type`, `log`.`lower_rate`, `log`.`higher_rate`\nFROM `log`\nWHERE `log`.`user_id` = :userId\n  AND `log`.`employment_id` = :employmentId\n  AND `log`.`from` >= DATE_SUB(DATE(:from), INTERVAL 13 WEEK)\n  AND `log`.`from` < DATE(:from)\nORDER BY `log`.`from`",
                      {
                          userId: oldShift.user_id,
                          from: oldShift.from,
                          employmentId: oldShift.employment_id,
                      }
                  )
                : [];

        const payDate = nextPayDate(oldShift.date);
        const payDates = {
            pay_date: formatDate(payDate, "yyyy-mm-dd"),
            pay_month: formatDate(payDate, "yy-mm"),
            pay_financial_year: financialYear(payDate),
            flowers_pay_month: flowersPayMonth(payDate),
        };

        const newShift = {
            ...oldShift,
            ...{
                ...calculateUsh(
                    oldShift.from,
                    oldShift.overrun_type === "OT"
                        ? oldShift.actual_to
                        : oldShift.planned_to,
                    oldShift.type,
                    additionalHours.time_and_half + additionalHours.double,
                    decimalHoursToMs(oldShift.weekly_hours),
                    log
                ),
                ...additionalHours,
                ...payDates,
            },
        };

        await executeWriteByPlaceholders(
            "UPDATE `log`\nSET `employment_id` = :employment_id,\n    `date` = :date,\n    `start` = :start,\n    `planned_end` = :planned_end,\n    `actual_end` = :actual_end,\n    `from` = :from,\n    `planned_to` = :planned_to,\n    `actual_to` = :actual_to,\n    `type` = :type,\n    `overrun_type` = :overrun_type,\n    `pay_id_override` = :pay_id_override,\n    `pay_date` = :pay_date,\n    `pay_month` = :pay_month,\n    `flowers_pay_month` = DATE_FORMAT(DATE_ADD(:pay_date, INTERVAL 1 MONTH), \'%y-%m\'),\n    `pay_financial_year` = :pay_financial_year,\n    `extras_ids_string` = :extras,\n    `toil` = :toil,\n    `flat` = :flat,\n    `lower_rate` = :lower_rate,\n    `time_and_half` = :time_and_half,\n    `higher_rate` = :higher_rate,\n    `double` = :double\nWHERE `user_id` = :userId AND `id` = :id",
            {
                actual_end: newShift.actual_end,
                actual_to: newShift.actual_to,
                contract_id: newShift.contract_id,
                date: newShift.date,
                double: newShift.double,
                employment_id: newShift.employment_id,
                extras: newShift.extras_ids_string,
                flat: newShift.flat,
                from: newShift.from,
                higher_rate: newShift.higher_rate,
                id: newShift.id,
                lower_rate: newShift.lower_rate,
                overrun_type: newShift.overrun_type,
                pay_date: newShift.pay_date,
                pay_financial_year: newShift.pay_financial_year,
                pay_id_override: newShift.pay_id_override,
                flowers_pay_month: newShift.flowers_pay_month,
                pay_month: newShift.pay_month,
                planned_end: newShift.planned_end,
                planned_to: newShift.planned_to,
                start: newShift.start,
                time_and_half: newShift.time_and_half,
                toil: newShift.toil,
                type: newShift.type,
                userId: newShift.user_id,
            }
        );
    }
}

main()
    .then(async () => {
        await pool.end();
        console.log("Log recalculated");
        process.exit(0);
    })
    .catch(async () => {
        await pool.end();
        console.error("Unable to recalculate log");
        process.exit(1);
    });
