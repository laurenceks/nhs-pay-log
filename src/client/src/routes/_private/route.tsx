import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_private")({
    component: Outlet,
    beforeLoad: () => {
        console.log("Private route - auth check");
    },
});
