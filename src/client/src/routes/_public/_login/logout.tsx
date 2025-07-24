import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/_login/logout")({
    component: () => {
        return <></>;
    },
    beforeLoad: ({ context }) => {
        context.auth?.logoutUser(false);
        throw redirect({ to: "/login" });
    },
});
