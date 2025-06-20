import { createFileRoute } from "@tanstack/react-router";
import Log from "../../../components/log/Log";
import { memo } from "react";
import { getLogQueryOptions } from "../../../queries/logQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";

export const Route = createFileRoute("/_private/log")({
    component: memo(Log),
    loader: async ({ context }) => {
        return await context.queryClient.ensureQueryData(
            stripQueryOptionsForEnsureQuery(getLogQueryOptions)
        );
    },
    shouldReload: ({ params }) => {
        return !Object.keys(params).length;
    },
    pendingMs: 0,
});
