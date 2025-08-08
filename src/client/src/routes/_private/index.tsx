import { createFileRoute } from "@tanstack/react-router";
import MainMenu from "../../components/common/mainMenu/MainMenu";

export const Route = createFileRoute("/_private/")({
    component: MainMenu,
});
