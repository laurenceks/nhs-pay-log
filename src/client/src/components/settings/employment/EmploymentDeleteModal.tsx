import { Button, Modal } from "react-bootstrap";
import { Dispatch, SetStateAction, useState } from "react";

const EmploymentDeleteModal = ({
    onClick,
    disabled,
    setShowModal,
    employmentName = "this employment",
}: {
    onClick: () => Promise<void>;
    disabled: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    employmentName?: string;
}) => {
    const [show, setShow] = useState(true);

    const closeModal = async () => {
        setShow(false);
    };

    return (
        <Modal
            show={show}
            size="lg"
            fullscreen={"lg-down"}
            onExited={() => setShowModal(false)}
        >
            <Modal.Header className="bg-danger text-white">
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to delete {employmentName}?</p>
                <p>
                    Its shifts will be transferred to the next available
                    employment. This may be unpredictable and it might be best
                    to manually transfer the shifts before proceeding.
                </p>
                <p>
                    This action{" "}
                    <span className="bg-danger text-white rounded rounded-1 p-1">
                        cannot
                    </span>{" "}
                    be undone
                </p>
            </Modal.Body>
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

export default EmploymentDeleteModal;
