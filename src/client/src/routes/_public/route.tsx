import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
    beforeLoad: async ({ context, location }) => {
        if (
            location.pathname !== "/logout" &&
            context.auth?.loginCheckedOnce &&
            (await context.auth?.isAuth())
        ) {
            throw redirect({ to: "/" });
        }
    },
    component: () => (
        <div className="p-3 minh-100">
            <Outlet />
        </div>
    ),
});
