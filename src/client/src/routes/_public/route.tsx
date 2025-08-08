import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import PageMargin from "../../components/common/PageMargin";

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
        <PageMargin>
            <Outlet />
        </PageMargin>
    ),
});
