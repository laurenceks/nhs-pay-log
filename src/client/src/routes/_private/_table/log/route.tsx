import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import Log from "../../../../components/log/Log";
import { ParsedApiShift } from "../../../../../../../types/commonTypes";
import { stripQueryOptionsForEnsureQuery } from "../../../../queries/queryUtils";
import { getLogQueryOptions } from "../../../../queries/logQueries";
import { getContractsQueryOptions } from "../../../../queries/contractQueries";

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

        const contracts = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getContractsQueryOptions)
            )
        ).data.map((x) => ({ ...x, weekly_hours: Number(x.weekly_hours) }));

        return { log, contracts };
    },
});
