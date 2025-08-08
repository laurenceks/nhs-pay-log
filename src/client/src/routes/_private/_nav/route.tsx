import { createFileRoute, Outlet } from "@tanstack/react-router";
import Nav from "../../../components/common/nav/Nav";

export const Route = createFileRoute("/_private/_nav")({
    component: () => {
        return (
            <>
                <Nav />
                <Outlet />
            </>
        );
    },
});
