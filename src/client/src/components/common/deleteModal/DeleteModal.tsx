import { Modal } from "react-bootstrap";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { ModalProps } from "react-bootstrap/Modal";
import DeleteModalHeader from "./DeleteModalHeader";
import DeleteModalFooter from "./DeleteModalFooter";

const DeleteModal = ({
    onClick,
    setShowModal,
    children,
    disabled = false,
    size,
    fullscreen,
}: {
    onClick: () => Promise<void>;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
    disabled?: boolean;
    size?: ModalProps["size"];
    fullscreen?: ModalProps["fullscreen"];
}) => {
    const [show, setShow] = useState(true);

    const closeModal = async () => {
        setShow(false);
    };

    return (
        <Modal
            show={show}
            size={size}
            fullscreen={fullscreen}
            onExited={() => setShowModal(false)}
        >
            <DeleteModalHeader />
            <Modal.Body>{children}</Modal.Body>
            <DeleteModalFooter
                onClick={onClick}
                closeModal={closeModal}
                disabled={disabled}
            />
        </Modal>
    );
};

export default DeleteModal;
