import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_margin")({
    component: () => (
        <div className="p-3 minh-100">
            <Outlet />
        </div>
    ),
});
