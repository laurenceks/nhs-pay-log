import { createFileRoute } from "@tanstack/react-router";
import Settings from "../../../components/settings/Settings";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { getContractsQueryOptions } from "../../../queries/contractQueries";
import { getEmploymentsQueryOptions } from "../../../queries/employmentQueries";

export const Route = createFileRoute("/_private/_table/settings")({
    component: Settings,
    loader: async ({ context }) => {
        const contracts = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getContractsQueryOptions)
            )
        ).data.map((x) => ({
            ...x,
            weekly_hours: Number(x.weekly_hours),
            pension_perc: Number(x.pension_perc),
            personal_allowance: Number(x.personal_allowance),
        }));
        const employments = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getEmploymentsQueryOptions)
            )
        ).data;
        return { contracts, employments };
    },
});
