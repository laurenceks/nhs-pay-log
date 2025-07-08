import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "../../../../components/login/ForgotPassword";

export const Route = createFileRoute("/_public/_login/forgot/")({
    component: ForgotPassword,
});
