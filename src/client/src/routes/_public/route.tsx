import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
    beforeLoad: async ({ context }) => {
        console.log(
            context.auth?.loginCheckedOnce,
            await context.auth?.isAuth()
        );
        if (context.auth?.loginCheckedOnce && (await context.auth?.isAuth())) {
            throw redirect({ to: "/" });
        }
    },
    component: () => (
        <div className="p-3 h-100">
            <Outlet />
        </div>
    ),
});
