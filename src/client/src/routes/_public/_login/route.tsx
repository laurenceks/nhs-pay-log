import { createFileRoute } from "@tanstack/react-router";
import LoginWrapper from "../../../components/login/LoginWrapper";

export const Route = createFileRoute("/_public/_login")({
    component: LoginWrapper,
});
