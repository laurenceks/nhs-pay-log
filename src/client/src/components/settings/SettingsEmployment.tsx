import { useLoaderData } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import SettingsContractRow from "./SettingsContractRow";
import { Contract } from "../../../../../types/commonTypes";
import { Dispatch, SetStateAction, useReducer, useState } from "react";
import { Employment } from "../../../../../types/lookupTypes";
import employmentReducer from "../../reducers/employmentReducer";
import SettingsContractRowEdit from "./SettingsContractRowEdit";
import { z } from "zod";
import { clientEmploymentValidationSchema } from "../../../../shared/validationSchemas/employmentValidationSchema";
import { toast } from "react-hot-toast";

const SettingsEmployment = ({
    employment,
    employmentEditId,
    setEmploymentEditId,
}: {
    employment: Employment;
    employmentEditId: Employment["id"] | null;
    setEmploymentEditId: Dispatch<SetStateAction<Employment["id"] | null>>;
}) => {
    const { contracts } = useLoaderData({
        from: "/_private/_table/settings",
    });
    const [contractEditId, setContractEditId] = useState<Contract["id"] | null>(
        null
    );
    const [employmentContracts, setEmploymentContracts] = useReducer(
        employmentReducer,
        contracts.filter((x: Contract) => x.employment_id === employment.id)
    );
    const isEditing = employmentEditId === employment.id;
    const validationResult = z.safeParse(clientEmploymentValidationSchema, {
        ...employment,
        contracts: employmentContracts,
    });

    if (validationResult.error?.issues.length) {
        toast.error(
            validationResult.error?.issues.map((x) => x.message).join("\n"),
            { id: `employment-${employment.id}-validationError` }
        );
    }
    return (
        <div className="py-3">
            <h3 className="px-3">{employment.name}</h3>
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
                            disabled={isEditing && !validationResult.success}
                            onClick={() => {
                                console.log("Saving " + employment.name);
                                setContractEditId(null);
                                setEmploymentEditId(null);
                            }}
                        >
                            Save
                        </Button>
                        <Button
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
                    </>
                ) : (
                    <Button
                        variant="warning"
                        disabled={employmentEditId !== null}
                        onClick={() => {
                            setEmploymentEditId(employment.id);
                        }}
                    >
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SettingsEmployment;
