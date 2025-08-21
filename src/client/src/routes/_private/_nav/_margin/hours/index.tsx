import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import { createFileRoute } from "@tanstack/react-router";
import { getEmploymentsQueryOptions } from "../../../../../queries/employmentQueries";
import HoursList from "../../../../../components/hours/HoursList";

export const Route = createFileRoute("/_private/_nav/_margin/hours/")({
    component: HoursList,
    loader: async ({ context }) => {
        const employments = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getEmploymentsQueryOptions)
            )
        ).data;

        return { employments };
    },
});
