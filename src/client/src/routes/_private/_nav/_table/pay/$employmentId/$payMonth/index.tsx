import { createFileRoute } from "@tanstack/react-router";
import { Modal } from "react-bootstrap";
import PayDetailModal from "../../../../../../../components/pay/PayDetailModal";

export const Route = createFileRoute(
    "/_private/_nav/_table/pay/$employmentId/$payMonth/"
)({
    component: PayDetailModal,
    errorComponent: () => <Modal show={true}>Something went wrong</Modal>,
});
