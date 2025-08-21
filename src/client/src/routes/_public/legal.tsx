import { createFileRoute } from "@tanstack/react-router";
import Legal from "../../components/login/Legal";

export const Route = createFileRoute("/_public/legal")({
    component: Legal,
});
