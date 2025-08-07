import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { useState } from "react";
import { ClientUser } from "../../../types/commonTypes";
import { getLoginFetch } from "./queries/loginQueries";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast, Toaster } from "react-hot-toast";
import { fetchLogout } from "./queries/queryUtils";
import Cookies from "js-cookie";
import { queryClient } from "../../shared/queryClient";

export type Auth = {
    loginCheckedOnce: boolean;
    user: null | ClientUser;
    login: (user: ClientUser) => void;
    logoutUser: (sessionExpired?: boolean) => void;
    isAuth: () => Promise<boolean>;
    setRedirect: (url: string) => void;
};

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
        logoutUser: (_sessionExpired) => {},
        setRedirect: (_url) => {},
        isAuth: async () => false,
    });
    const logoutUser = async (sessionExpired: boolean = false) => {
        queryClient.invalidateQueries();
        Cookies.remove("sessionExpiry");
        setAuth((prevState) => ({
            ...prevState,
            loginCheckedOnce: true,
            user: null,
        }));
        await fetchLogout();
        if (sessionExpired) {
            toast.error("Your session has expired", { id: "logout" });
        } else {
            toast.success("You have been logged out", { id: "logout" });
        }
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
                <div className="mw-100 w-100" style={{ minHeight: "100%" }}>
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
                                logoutUser,
                                isAuth: async () => {
                                    if (
                                        Cookies.get("sessionExpiry") &&
                                        auth.user &&
                                        auth.loginCheckedOnce
                                    ) {
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
                                            return false;
                                        }
                                    }
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
