import { Button, Modal } from "react-bootstrap";

const DeleteModal = ({
    onClick,
    closeModal,
    disabled = false,
    closeOnConfirm = true,
}: {
    onClick: () => Promise<void>;
    closeModal: () => Promise<void>;
    disabled?: boolean;
    closeOnConfirm?: boolean;
}) => (
    <Modal.Footer>
        <Button disabled={disabled} onClick={closeModal} variant="success">
            Cancel
        </Button>
        <Button
            disabled={disabled}
            onClick={async () => {
                if (closeOnConfirm) {
                    await closeModal();
                }
                await onClick();
            }}
            variant="danger"
        >
            Delete
        </Button>
    </Modal.Footer>
);

export default DeleteModal;
