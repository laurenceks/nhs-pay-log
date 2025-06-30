import { createFileRoute } from "@tanstack/react-router";
import Log from "../../../components/log/Log";
import { memo } from "react";
import { getLogQueryOptions } from "../../../queries/logQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { getContractsQueryOptions } from "../../../queries/contractQueries";

export const Route = createFileRoute("/_private/log")({
    component: memo(Log),
    loader: async ({ context }) => {
        const log =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getLogQueryOptions)
                )
            ).data || [];

        const contracts = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getContractsQueryOptions)
            )
        ).data.map((x) => ({ ...x, weekly_hours: Number(x.weekly_hours) }));

        return { log, contracts };
    },
});
