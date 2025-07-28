import { Modal } from "react-bootstrap";

const DeleteModal = () => {
    return (
        <Modal.Header className="bg-danger text-white">
            <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
    );
};

export default DeleteModal;
