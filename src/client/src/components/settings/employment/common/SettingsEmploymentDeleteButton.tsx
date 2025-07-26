import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { UseMutateFunction } from "@tanstack/react-query";
import { ApiResponse } from "../../../../../../../types/responseTypes";

const SettingsEmploymentDeleteButton = ({
    employmentName,
    deleteMutate,
    disabled,
    isOnlyEmployment,
}: {
    employmentName: string;
    deleteMutate: UseMutateFunction;
    disabled: boolean;
    isOnlyEmployment: boolean;
}) => {
    return !isOnlyEmployment ? (
        <Button
            variant="danger"
            disabled={disabled}
            onClick={async () => {
                try {
                    await deleteMutate();
                    toast.success(`${employmentName} deleted`);
                } catch (e) {
                    toast.error(
                        (e as ApiResponse).errorCode === "validationError" ||
                            (e as ApiResponse).errorCode ===
                                "employmentDeleteError"
                            ? (e as ApiResponse).message
                            : `Unable to delete ${employmentName}`
                    );
                }
            }}
        >
            Delete
        </Button>
    ) : null;
};

export default SettingsEmploymentDeleteButton;
