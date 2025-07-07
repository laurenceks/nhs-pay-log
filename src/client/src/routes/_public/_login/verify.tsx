import { createFileRoute } from "@tanstack/react-router";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { getVerifyQueryOptions } from "../../../queries/loginQueries";
import Verify from "../../../components/login/Verify";

export const Route = createFileRoute("/_public/_login/verify")({
    component: () => (
        <Verify
            success={true}
            message="You have successfully verified your account and can now log in"
        />
    ),
    errorComponent: ({ error }) => (
        <Verify success={false} message={error.message} />
    ),
    pendingComponent: () => <div>Loading</div>,
    validateSearch: (
        search: Record<string, unknown>
    ): { selector: string; token: string } => {
        return {
            selector: (search.selector as string) || "",
            token: (search.token as string) || "",
        };
    },
    loaderDeps: ({ search: { selector, token } }) => ({ selector, token }),
    loader: async ({ context, deps: { selector, token } }) => {
        return await context.queryClient.ensureQueryData(
            stripQueryOptionsForEnsureQuery(
                getVerifyQueryOptions(selector, token)
            )
        );
    },
});
