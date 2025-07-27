import { Button, Modal } from "react-bootstrap";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { ModalProps } from "react-bootstrap/Modal";

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
            <Modal.Header className="bg-danger text-white">
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button
                    disabled={disabled}
                    onClick={closeModal}
                    variant="success"
                >
                    Cancel
                </Button>
                <Button
                    disabled={disabled}
                    onClick={async () => {
                        setShow(false);
                        await onClick();
                    }}
                    variant="danger"
                >
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
