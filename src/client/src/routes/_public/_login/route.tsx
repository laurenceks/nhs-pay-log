import { createFileRoute } from "@tanstack/react-router";
import LoginWrapper from "../../../components/login/LoginWrapper.tsx";

export const Route = createFileRoute("/_public/_login")({
    beforeLoad: () => {
        console.log("Login route");
    },
    component: LoginWrapper,
});
