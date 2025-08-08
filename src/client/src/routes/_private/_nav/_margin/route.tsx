import { createFileRoute, Outlet } from "@tanstack/react-router";
import PageMargin from "../../../../components/common/PageMargin";

export const Route = createFileRoute("/_private/_nav/_margin")({
    component: () => (
        <PageMargin>
            <Outlet />
        </PageMargin>
    ),
});
