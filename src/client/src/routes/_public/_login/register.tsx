import { createFileRoute } from "@tanstack/react-router";
import Register from "../../../components/login/Register";
import { getRegisterOptionsQueryOptions } from "../../../queries/loginQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";

export const Route = createFileRoute("/_public/_login/register")({
    component: Register,
    loader: async ({ context }) => {
        return (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getRegisterOptionsQueryOptions)
            )
        ).data;
    },
});
