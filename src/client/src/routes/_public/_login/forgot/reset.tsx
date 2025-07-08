import { createFileRoute } from "@tanstack/react-router";
import Loading from "../../../../components/common/Loading";
import ResetPassword from "../../../../components/login/ResetPassword";
import PasswordResetError from "../../../../components/login/PasswordResetError";

export const Route = createFileRoute("/_public/_login/forgot/reset")({
    component: ResetPassword,
    errorComponent: ({ error }) => (
        <PasswordResetError message={error.message} />
    ),
    pendingComponent: Loading,
    validateSearch: (
        search: Record<string, unknown>
    ): { selector: string; token: string } => {
        if (!search.selector || !search.token) {
            throw new Error("No token/selector passed");
        }
        return {
            selector: (search.selector as string) || "",
            token: (search.token as string) || "",
        };
    },
});
