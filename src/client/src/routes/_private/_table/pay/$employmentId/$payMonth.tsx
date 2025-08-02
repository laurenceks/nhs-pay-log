import { createFileRoute } from "@tanstack/react-router";
import PayDetailModal from "../../../../../components/pay/PayDetailModal";
import { Modal } from "react-bootstrap";

export const Route = createFileRoute(
    "/_private/_table/pay/$employmentId/$payMonth"
)({
    component: PayDetailModal,
    errorComponent: () => <Modal show={true}>Something went wrong</Modal>,
});
