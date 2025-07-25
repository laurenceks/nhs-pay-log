import { Button, Form, Table } from "react-bootstrap";
import SettingsContractRow from "./SettingsContractRow";
import { Contract } from "../../../../../types/commonTypes";
import { Dispatch, SetStateAction, useReducer, useState } from "react";
import { Employment } from "../../../../../types/lookupTypes";
import employmentReducer from "../../reducers/employmentReducer";
import SettingsContractRowEdit from "./SettingsContractRowEdit";
import { z } from "zod";
import { clientEmploymentValidationSchema } from "../../../../shared/validationSchemas/employmentValidationSchema";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import {
    deleteEmploymentMutationOptions,
    patchEmploymentMutationOptions,
} from "../../queries/employmentQueries";
import { ApiResponse } from "../../../../../types/responseTypes";

const SettingsEmployment = ({
    employment,
    contracts,
    employmentEditId,
    setEmploymentEditId,
    isOnlyEmployment,
}: {
    employment: Employment;
    contracts: Contract[];
    employmentEditId: Employment["id"] | null;
    setEmploymentEditId: Dispatch<SetStateAction<Employment["id"] | null>>;
    isOnlyEmployment: boolean;
}) => {
    //TODO split into static and edit components to handle post save updates and avoid excessive states
    const [name, setName] = useState(employment.name);
    const [contractEditId, setContractEditId] = useState<Contract["id"] | null>(
        null
    );
    const [employmentContracts, setEmploymentContracts] = useReducer(
        employmentReducer,
        contracts
    );
    const isEditing = employmentEditId === employment.id;

    const validationResult = z.safeParse(clientEmploymentValidationSchema, {
        ...employment,
        name,
        contracts: employmentContracts || [],
    });
    const { mutateAsync: patchMutate, isPending: patchPending } = useMutation({
        ...patchEmploymentMutationOptions({
            ...employment,
            name,
            contracts: employmentContracts,
        }),
    });
    const { mutateAsync: deleteMutate, isPending: deletePending } = useMutation(
        {
            ...deleteEmploymentMutationOptions(employment.id),
        }
    );

    if (validationResult.error?.issues.length) {
        toast.error(
            validationResult.error?.issues.map((x) => x.message).join("\n"),
            { id: `employment-${employment.id}-validationError` }
        );
    }
    return (
        <div className="py-3">
            {isEditing ? (
                <Form.Group className="px-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.currentTarget.value)}
                        type="text"
                        isInvalid={!name}
                        size="lg"
                    />
                </Form.Group>
            ) : (
                <h3 className="px-3">{employment.name}</h3>
            )}
            <Table striped={true} hover={isEditing} responsive={true}>
                <thead>
                    <tr>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Pay band</th>
                        <th scope="col">HCA type</th>
                        <th scope="col">Weekly hours</th>
                        <th scope="col">Pension %</th>
                        <th scope="col">Personal allowance</th>
                        <th
                            scope="col"
                            colSpan={contractEditId !== null ? 2 : 1}
                        >
                            Student loan
                        </th>
                    </tr>
                </thead>
                <tbody style={isEditing ? { cursor: "pointer" } : {}}>
                    {employmentContracts.map((x, i) =>
                        contractEditId === x.id ? (
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
                                onClick={() => {
                                    if (isEditing) {
                                        setContractEditId(x.id);
                                    }
                                }}
                            />
                        )
                    )}
                </tbody>
            </Table>
            <div className="ms-3 d-flex column-gap-2">
                {isEditing ? (
                    <>
                        <Button
                            variant="success"
                            disabled={
                                (isEditing && !validationResult.success) ||
                                patchPending ||
                                deletePending
                            }
                            onClick={async () => {
                                try {
                                    await patchMutate();
                                    setContractEditId(null);
                                    setEmploymentEditId(null);
                                    toast.success(`${name} updated`, {
                                        id: `employment-${employment.id}-updated`,
                                    });
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
                                    payload: contracts.filter(
                                        (x: Contract) =>
                                            x.employment_id === employment.id
                                    ),
                                });
                            }}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="warning"
                        disabled={
                            employmentEditId !== null ||
                            deletePending ||
                            patchPending
                        }
                        onClick={() => {
                            setEmploymentEditId(employment.id);
                        }}
                    >
                        Edit
                    </Button>
                )}
                {!isOnlyEmployment && (
                    <Button
                        variant="danger"
                        disabled={deletePending}
                        onClick={async () => {
                            try {
                                await deleteMutate();
                                toast.success(`${employment.name} deleted`);
                            } catch (e) {
                                toast.error(
                                    (e as ApiResponse).errorCode ===
                                        "validationError"
                                        ? (e as ApiResponse).message
                                        : `Unable to delete ${employment.name}`
                                );
                            }
                        }}
                    >
                        Delete
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SettingsEmployment;
