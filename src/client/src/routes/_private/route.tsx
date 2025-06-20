import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
    component: Outlet,
    beforeLoad: async ({ context }) => {
        if (!(await context.auth?.isAuth())) {
            window.localStorage.setItem(
                "redirect",
                location.pathname + location.hash + location.search
            );
            context.auth?.logout();
            throw redirect({
                to: "/login",
            });
        }
    },
});
