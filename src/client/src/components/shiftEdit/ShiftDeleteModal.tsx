import { Dispatch, SetStateAction } from "react";
import Highlight from "../common/Highlight";
import { Modal } from "react-bootstrap";
import DeleteModalHeader from "../common/deleteModal/DeleteModalHeader";
import DeleteModalFooter from "../common/deleteModal/DeleteModalFooter";

const ShiftDeleteModal = ({
    setShowDeleteModal,
    disabled,
    onClick,
}: {
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
    disabled: boolean;
    onClick: () => Promise<void>;
}) => {
    return (
        <>
            <DeleteModalHeader />
            <Modal.Body>
                <p>Are you sure you want to delete your your shift?</p>
                <p>
                    This action <Highlight>cannot</Highlight> be undone
                </p>
            </Modal.Body>
            <DeleteModalFooter
                onClick={onClick}
                closeModal={async () => setShowDeleteModal(false)}
                disabled={disabled}
                closeOnConfirm={false}
            />
        </>
    );
};

export default ShiftDeleteModal;
