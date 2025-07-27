import { Dispatch, SetStateAction } from "react";
import DeleteModal from "../../common/DeleteModal";
import Highlight from "../../common/Highlight";

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
    return (
        <DeleteModal
            onClick={onClick}
            disabled={disabled}
            setShowModal={setShowModal}
            size="lg"
            fullscreen="md-down"
        >
            <p>Are you sure you want to delete {employmentName}?</p>
            <p>
                Its shifts will be transferred to the next available employment.
                This may be unpredictable and it might be best to manually
                transfer the shifts before proceeding.
            </p>
            <p>
                This action <Highlight>cannot</Highlight> be undone
            </p>
        </DeleteModal>
    );
};

export default EmploymentDeleteModal;
