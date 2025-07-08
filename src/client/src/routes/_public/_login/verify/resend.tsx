import { createFileRoute } from "@tanstack/react-router";
import ResendVerification from "../../../../components/login/ResendVerification";

export const Route = createFileRoute("/_public/_login/verify/resend")({
    component: ResendVerification,
});
