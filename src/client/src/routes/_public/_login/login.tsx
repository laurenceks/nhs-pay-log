import { createFileRoute } from "@tanstack/react-router";
import Login from "../../../components/login/Login.tsx";

export const Route = createFileRoute("/_public/_login/login")({
    component: Login,
});
