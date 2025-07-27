import { useEffect, useState } from "react";
import ShiftDeleteModal from "./ShiftDeleteModal";
import ShiftEditModal from "./ShiftEditModal";
import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "react-hot-toast";

const ShiftEdit = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteComplete, setDeleteComplete] = useState(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const { shiftId } = useParams({ from: "/_private/_table/log/$shiftId" });

    const navigate = useNavigate();

    useEffect(() => {
        if (deleteComplete) {
            toast.success(toastMessage, {
                id: `shift-${shiftId}-delete-message`,
            });
            navigate({ to: "/log" });
        }
    }, [deleteComplete]);

    return showDeleteModal || deleteComplete ? (
        <ShiftDeleteModal
            setShowDeleteModal={setShowDeleteModal}
            setDeleteComplete={setDeleteComplete}
            setToastMessage={setToastMessage}
            shiftId={shiftId}
        />
    ) : (
        <ShiftEditModal
            toastMessage={toastMessage}
            setToastMessage={setToastMessage}
            setShowDeleteModal={setShowDeleteModal}
        />
    );
};

export default ShiftEdit;
