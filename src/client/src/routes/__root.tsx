import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient } from "@tanstack/react-query";
import { Auth } from "../App";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    auth?: Auth;
}>()({
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
});
