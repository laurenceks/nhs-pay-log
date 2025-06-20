import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/_login/logout")({
    component: () => {
        return <></>;
    },
    beforeLoad: ({ context }) => {
        context.auth?.logout();
        throw redirect({ to: "/login" });
    },
});
