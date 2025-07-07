import { createFileRoute } from "@tanstack/react-router";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { getVerifyQueryOptions } from "../../../queries/loginQueries";
import Verify from "../../../components/login/Verify";
import Loading from "../../../components/common/Loading";

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
    pendingComponent: Loading,
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
        await new Promise((resolve) => setTimeout(resolve, 100000000000000000));
        return await context.queryClient.ensureQueryData(
            stripQueryOptionsForEnsureQuery(
                getVerifyQueryOptions(selector, token)
            )
        );
    },
});
