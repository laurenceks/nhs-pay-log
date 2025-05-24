import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
    beforeLoad: () => {
        console.log("Public route");
    },
    component: Outlet,
});
