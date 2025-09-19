import { Button, Form, Table } from "react-bootstrap";
import { Contract } from "../../../../../../types/commonTypes";
import { ActionDispatch, Dispatch, SetStateAction } from "react";
import { Employment } from "../../../../../../types/lookupTypes";
import { EmploymentReducerOptions } from "../../../reducers/employmentReducer";
import SettingsContractRowEdit from "./contractRow/SettingsContractRowEdit";
import { z } from "zod";
import { clientEmploymentValidationSchema } from "../../../../../shared/validationSchemas/employmentValidationSchema";
import { toast } from "react-hot-toast";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { ApiResponse } from "../../../../../../types/responseTypes";
import SettingsEmploymentThead from "./common/SettingsEmploymentThead";
import SettingsEmploymentDeleteButton from "./common/SettingsEmploymentDeleteButton";
import SettingsContractRow from "./contractRow/SettingsContractRow";

const SettingsEmploymentEdit = ({
    employment,
    employmentContracts,
    setEmploymentContracts,
    deleteMutate,
    deletePending,
    patchMutate,
    patchPending,
    setEmploymentEditId,
    contractEditId,
    setContractEditId,
    name,
    setName,
    isOnlyEmployment,
    filteredContracts,
}: {
    employment: Employment;
    employmentContracts: Contract[];
    filteredContracts: Contract[];
    setEmploymentContracts: ActionDispatch<[EmploymentReducerOptions]>;
    deleteMutate: UseMutateAsyncFunction;
    deletePending: boolean;
    patchMutate: UseMutateAsyncFunction;
    patchPending: boolean;
    setEmploymentEditId: Dispatch<SetStateAction<Employment["id"] | null>>;
    contractEditId: Contract["id"] | null;
    setContractEditId: Dispatch<SetStateAction<Contract["id"] | null>>;
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    isOnlyEmployment: boolean;
}) => {
    const validationResult = z.safeParse(clientEmploymentValidationSchema, {
        ...employment,
        name,
        contracts: employmentContracts || [],
    });

    if (validationResult.error?.issues.length) {
        toast.error(
            validationResult.error?.issues.map((x) => x.message).join("\n"),
            { id: `employment-${employment.id}-validationError` }
        );
    }
    return (
        <>
            <Form.Group className="px-3 mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                    type="text"
                    isInvalid={!name}
                    size="lg"
                />
            </Form.Group>
            <Table striped={true} hover={true} responsive={true}>
                <SettingsEmploymentThead spanLast={contractEditId !== null} />
                <tbody style={{ cursor: "pointer" }}>
                    {employmentContracts.map((x, i) => {
                        return x.id === contractEditId ? (
                            <SettingsContractRowEdit
                                key={x.id}
                                contract={x}
                                setEmploymentContracts={setEmploymentContracts}
                                setContractEditId={setContractEditId}
                                first={i === 0}
                                last={i === employmentContracts.length - 1}
                            />
                        ) : (
                            <SettingsContractRow
                                key={x.id}
                                contract={x}
                                isEditing={contractEditId !== null}
                                onClick={() => setContractEditId(x.id)}
                            />
                        );
                    })}
                </tbody>
            </Table>
            <div className="ms-3 d-flex column-gap-2">
                <>
                    <Button
                        variant="success"
                        disabled={
                            !validationResult.success ||
                            deletePending ||
                            patchPending
                        }
                        onClick={async () => {
                            try {
                                await patchMutate();
                                setContractEditId(null);
                                setEmploymentEditId(null);
                            } catch (e) {
                                toast.error(
                                    (e as ApiResponse).message ||
                                        "There was a problem saving the employment, please try again",
                                    {
                                        id: `employment-${employment.id}-delete-error`,
                                    }
                                );
                            }
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        disabled={deletePending || patchPending}
                        onClick={() => {
                            setContractEditId(0);
                            setEmploymentContracts({
                                action: "addContract",
                                payload: {
                                    employmentId: employment.id,
                                    employmentName: employment.name,
                                },
                            });
                        }}
                    >
                        Add row
                    </Button>
                    <Button
                        variant="outline-primary"
                        disabled={deletePending || patchPending}
                        onClick={() => {
                            setContractEditId(null);
                            setEmploymentEditId(null);
                            setEmploymentContracts({
                                action: "reset",
                                payload: filteredContracts,
                            });
                        }}
                    >
                        Cancel
                    </Button>
                    <SettingsEmploymentDeleteButton
                        employmentName={employment.name}
                        deleteMutate={deleteMutate}
                        disabled={deletePending || patchPending}
                        isOnlyEmployment={isOnlyEmployment}
                    />
                </>
            </div>
        </>
    );
};

export default SettingsEmploymentEdit;
