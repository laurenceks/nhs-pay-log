import { useState } from "react";
import ShiftDeleteModal from "./ShiftDeleteModal";
import ShiftEditModal from "./ShiftEditModal";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { deleteLogShiftMutationOptions } from "../../queries/logQueries";
import { Modal } from "react-bootstrap";

const ShiftEdit = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const { shiftId } = useParams({
        from: "/_private/_nav/_table/log/$shiftId",
    });

    const { mutateAsync, isPending } = useMutation({
        ...deleteLogShiftMutationOptions(Number(shiftId)),
    });

    const [show, setShow] = useState<boolean>(true);

    const navigate = useNavigate();

    return (
        <Modal
            show={show}
            onExited={() => {
                if (toastMessage) {
                    toast.success(toastMessage, {
                        id: `shift-${shiftId}-success-message`,
                    });
                }
                navigate({ to: "/log" });
            }}
            size="lg"
            fullscreen={"lg-down"}
        >
            {showDeleteModal ? (
                <ShiftDeleteModal
                    setShowDeleteModal={setShowDeleteModal}
                    disabled={isPending}
                    onClick={async () => {
                        try {
                            await mutateAsync();
                            setToastMessage("Shift deleted");
                            setShow(false);
                        } catch (_e) {
                            toast.error("Unable to delete shift", {
                                id: `shift-${shiftId}-delete-error-message`,
                            });
                        }
                    }}
                />
            ) : (
                <ShiftEditModal
                    setShow={setShow}
                    setToastMessage={setToastMessage}
                    setShowDeleteModal={setShowDeleteModal}
                />
            )}
        </Modal>
    );
};

export default ShiftEdit;
