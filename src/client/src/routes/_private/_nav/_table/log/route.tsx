import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import Log from "../../../../../components/log/Log";
import { ParsedApiShift } from "../../../../../../../../types/commonTypes";
import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import { getLogQueryOptions } from "../../../../../queries/logQueries";
import { formatDate } from "../../../../../../../shared/utils/formatDates";
import { roundTo } from "round-to";
import { msToDecimalHours } from "../../../../../../../shared/utils/conversions";
import { getContractsQueryOptions } from "../../../../../queries/contractQueries";

export const Route = createFileRoute("/_private/_nav/_table/log")({
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
                    absent_hours: Number(x.absent_hours),
                    half_is_all_ush: !!x.half_is_all_ush,
                    break_from_higher: !!x.break_from_higher,
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
                    extra_pay: Number(x.extra_pay),
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
                    absent_hours: roundTo(msToDecimalHours(x.absent_hours), 3),
                    break_from_higher: !!x.break_from_higher,
                    half_is_all_ush: !!x.half_is_all_ush,
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
