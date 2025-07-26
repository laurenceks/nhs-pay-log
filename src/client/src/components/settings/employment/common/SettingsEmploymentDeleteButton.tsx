import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { ApiResponse } from "../../../../../../../types/responseTypes";
import { useState } from "react";
import EmploymentDeleteModal from "../EmploymentDeleteModal";

const SettingsEmploymentDeleteButton = ({
    employmentName,
    deleteMutate,
    disabled,
    isOnlyEmployment,
}: {
    employmentName: string;
    deleteMutate: UseMutateAsyncFunction;
    disabled: boolean;
    isOnlyEmployment: boolean;
}) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    return !isOnlyEmployment ? (
        <>
            <Button
                variant="danger"
                disabled={disabled}
                onClick={() => setShowModal(true)}
            >
                Delete
            </Button>
            {showModal && (
                <EmploymentDeleteModal
                    onClick={async () => {
                        try {
                            await deleteMutate();
                            toast.success(`${employmentName} deleted`);
                        } catch (e) {
                            toast.error(
                                (e as ApiResponse).errorCode ===
                                    "validationError" ||
                                    (e as ApiResponse).errorCode ===
                                        "employmentDeleteError"
                                    ? (e as ApiResponse).message
                                    : `Unable to delete ${employmentName}`
                            );
                        }
                    }}
                    disabled={disabled}
                    employmentName={employmentName}
                    setShowModal={setShowModal}
                />
            )}
        </>
    ) : null;
};

export default SettingsEmploymentDeleteButton;
