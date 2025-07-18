import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import Log from "../../../../components/log/Log";
import { ParsedApiShift } from "../../../../../../../types/commonTypes";
import { stripQueryOptionsForEnsureQuery } from "../../../../queries/queryUtils";
import { getLogQueryOptions } from "../../../../queries/logQueries";
import { getContractsQueryOptions } from "../../../../queries/contractQueries";
import { msToDecimalHours } from "../../../../../../shared/utils/conversions";
import { formatDate } from "../../../../../../shared/utils/formatDates";
import { roundTo } from "round-to";

export const Route = createFileRoute("/_private/_table/log")({
    component: memo(Log),
    loader: async ({ context }) => {
        const log: ParsedApiShift[] =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getLogQueryOptions)
                )
            ).data?.map((x) => {
                return {
                    ...x,
                    extra_hours: Number(x.extra_hours),
                    extra_pay: Number(x.extra_pay),
                    extras_pay: Number(x.extras_pay),
                    rate: Number(x.rate),
                    shift_pay: Number(x.shift_pay),
                    total_ush: Number(x.shift_pay),
                };
            }) || [];

        const displayLog: ParsedApiShift[] =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getLogQueryOptions)
                )
            ).data?.map((x) => {
                return {
                    ...x,
                    extra_hours: Number(x.extra_hours),
                    extras_pay: Number(x.extras_pay),
                    extra_pay: Number(x.extras_pay),
                    rate: Number(x.rate),
                    shift_pay: Number(x.shift_pay),
                    total_ush: Number(x.shift_pay),
                    from: formatDate(x.from, "dd/mm/yy"),
                    toil: roundTo(msToDecimalHours(x.toil), 3),
                    flat: roundTo(msToDecimalHours(x.flat), 3),
                    lower_rate: roundTo(msToDecimalHours(x.lower_rate), 3),
                    time_and_half: roundTo(
                        msToDecimalHours(x.time_and_half),
                        3
                    ),
                    higher_rate: roundTo(msToDecimalHours(x.higher_rate), 3),
                    double: roundTo(msToDecimalHours(x.double), 3),
                };
            }) || [];

        const contracts = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getContractsQueryOptions)
            )
        ).data.map((x) => ({ ...x, weekly_hours: Number(x.weekly_hours) }));

        return { log, displayLog, contracts };
    },
});
