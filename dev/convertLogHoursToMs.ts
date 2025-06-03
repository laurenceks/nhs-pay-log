import oldMockLogData from "../tests/data/mockLogDataOld";
import { decimalHoursToMs } from "../src/shared/utils/conversions";
import { CalculatedHours as LogShift } from "../types/commonTypes";
import * as fs from "fs";
import * as path from "path";

const newLog: LogShift[] = oldMockLogData.map((x) => {
    return {
        ...x,
        toil: decimalHoursToMs(x.toil),
        time_and_half: decimalHoursToMs(x.time_and_half),
        double: decimalHoursToMs(x.double),
        flat: decimalHoursToMs(x.flat),
        lower_rate: decimalHoursToMs(x.lower_rate),
        higher_rate: decimalHoursToMs(x.higher_rate),
    };
});

fs.writeFileSync(
    path.resolve("./tests/data/mockLogData.ts"),
    'import { LogShift } from "../../types/commonTypes";\n\nconst mockLogData: LogShift[] = ' +
        JSON.stringify(newLog) +
        ";\n\nexport default mockLogData;"
);
