import App from "../../App.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
    component: App,
});
