import { StrictMode } from "react";
import "./style.scss";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";

const router = createRouter({
    routeTree,
    pathParamsAllowedCharacters: [":"],
    defaultPendingMinMs: 0,
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <div className="mw-100 w-100">
                <RouterProvider router={router} />
            </div>
        </StrictMode>
    );
}
