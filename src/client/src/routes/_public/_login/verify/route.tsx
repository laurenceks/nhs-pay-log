import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/_login/verify")({
    component: Outlet,
});
