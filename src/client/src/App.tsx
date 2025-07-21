import { createRouter, redirect, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { useState } from "react";
import { ClientUser } from "../../../types/commonTypes";
import { getLoginFetch } from "./queries/loginQueries";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast, Toaster } from "react-hot-toast";
import { fetchLogout } from "./queries/queryUtils";
import Cookies from "js-cookie";

export type Auth = {
    loginCheckedOnce: boolean;
    user: null | ClientUser;
    login: (user: ClientUser) => void;
    logout: () => void;
    isAuth: () => Promise<boolean>;
    setRedirect: (url: string) => void;
};

export const queryClient = new QueryClient();
const router = createRouter({
    routeTree,
    defaultPendingMinMs: 0,
    context: { queryClient, auth: undefined },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const App = () => {
    const [auth, setAuth] = useState<Auth>({
        loginCheckedOnce: false,
        user: null,
        login: (_user) => {},
        logout: () => {},
        setRedirect: (_url) => {},
        isAuth: async () => false,
    });
    const logout = async () => {
        queryClient.invalidateQueries();
        Cookies.remove("sessionExpiry");
        setAuth((prevState) => ({
            ...prevState,
            loginCheckedOnce: true,
            user: null,
        }));
        await fetchLogout();
        redirect({ to: "/login" });
        toast.success("You have been logged out", { id: "logout" });
    };

    return (
        <>
            <Toaster
                toastOptions={{
                    success: {
                        iconTheme: { primary: "#2fb380", secondary: "#ffffff" },
                    },
                    error: {
                        iconTheme: { primary: "#da292e", secondary: "#ffffff" },
                    },
                }}
            />
            <QueryClientProvider client={queryClient}>
                <div className="mw-100 w-100 h-100">
                    <RouterProvider
                        router={router}
                        context={{
                            queryClient: queryClient,
                            auth: {
                                ...auth,
                                login: (user) =>
                                    setAuth((prevState) => ({
                                        ...prevState,
                                        loginCheckedOnce: true,
                                        user,
                                    })),
                                logout,
                                isAuth: async () => {
                                    if (auth.user && auth.loginCheckedOnce) {
                                        return true;
                                    }
                                    if (!auth.loginCheckedOnce) {
                                        try {
                                            const loginStatus =
                                                await getLoginFetch();
                                            if (loginStatus?.success) {
                                                setAuth((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        user: loginStatus.data!,
                                                        loginCheckedOnce: true,
                                                    };
                                                });
                                                return true;
                                            }
                                        } catch (_e) {
                                            await logout();
                                            return false;
                                        }
                                    }
                                    await logout();
                                    return false;
                                },
                                setRedirect: (url: string) =>
                                    setAuth((prevState) => ({
                                        ...prevState,
                                        redirect: url,
                                    })),
                            },
                        }}
                    />
                </div>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </>
    );
};

export default App;
