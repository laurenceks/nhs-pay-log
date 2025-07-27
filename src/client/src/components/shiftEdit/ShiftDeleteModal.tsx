import { Dispatch, SetStateAction } from "react";
import Highlight from "../common/Highlight";
import DeleteModal from "../common/DeleteModal";
import { toast } from "react-hot-toast";
import { ApiResponse } from "../../../../../types/responseTypes";
import { useMutation } from "@tanstack/react-query";
import { deleteLogShiftMutationOptions } from "../../queries/logQueries";

const ShiftDeleteModal = ({
    setDeleteComplete,
    setShowDeleteModal,
    setToastMessage,
    shiftId,
}: {
    setDeleteComplete: Dispatch<SetStateAction<boolean>>;
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
    setToastMessage: Dispatch<SetStateAction<string>>;
    shiftId: string;
}) => {
    const { mutateAsync: mutateDelete, isPending: deletePending } = useMutation(
        {
            ...deleteLogShiftMutationOptions(Number(shiftId)),
        }
    );

    return (
        <DeleteModal
            onClick={async () => {
                try {
                    setToastMessage("Shift deleted");
                    await mutateDelete();
                    setDeleteComplete(true);
                } catch (e) {
                    toast.error(
                        (e as ApiResponse).message ||
                            "There was a problem deleting the shift, please try again",
                        {
                            id: `shift-${shiftId}-delete-error`,
                        }
                    );
                }
            }}
            disabled={deletePending}
            fullscreen="sm-down"
            setShowModal={setShowDeleteModal}
        >
            <p>Are you sure you want to delete your your shift?</p>
            <p>
                This action <Highlight>cannot</Highlight> be undone
            </p>
        </DeleteModal>
    );
};

export default ShiftDeleteModal;
