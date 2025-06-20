import { createFileRoute } from "@tanstack/react-router";
import Register from "../../../components/login/Register";

export const Route = createFileRoute("/_public/_login/register")({
    component: Register,
});
