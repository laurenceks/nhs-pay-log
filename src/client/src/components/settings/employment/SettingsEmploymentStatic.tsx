import { Button, Table } from "react-bootstrap";
import SettingsContractRow from "./contractRow/SettingsContractRow";
import { Contract } from "../../../../../../types/commonTypes";
import { Dispatch, SetStateAction } from "react";
import { Employment } from "../../../../../../types/lookupTypes";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import SettingsEmploymentThead from "./common/SettingsEmploymentThead";
import SettingsEmploymentDeleteButton from "./common/SettingsEmploymentDeleteButton";

const SettingsEmploymentStatic = ({
    employment,
    employmentContracts,
    isOnlyEmployment,
    contractEditId,
    deleteMutate,
    deletePending,
    employmentEditId,
    setEmploymentEditId,
}: {
    employment: Employment;
    employmentContracts: Contract[];
    contractEditId: Contract["id"] | null;
    isOnlyEmployment: boolean;
    deleteMutate: UseMutateAsyncFunction;
    deletePending: boolean;
    employmentEditId: Contract["employment_id"] | null;
    setEmploymentEditId: Dispatch<SetStateAction<Employment["id"] | null>>;
}) => {
    return (
        <>
            <h3 className="px-3">{employment.name}</h3>
            <Table striped={true} hover={false} responsive={true}>
                <SettingsEmploymentThead />
                <tbody>
                    {employmentContracts.map((x) => (
                        <SettingsContractRow
                            key={x.id}
                            contract={x}
                            isEditing={contractEditId !== null}
                        />
                    ))}
                </tbody>
            </Table>
            <div className="ms-3 d-flex column-gap-2">
                <Button
                    variant="warning"
                    disabled={deletePending || !!employmentEditId}
                    onClick={() => {
                        setEmploymentEditId(employment.id);
                    }}
                >
                    Edit
                </Button>
                <SettingsEmploymentDeleteButton
                    employmentName={employment.name}
                    deleteMutate={deleteMutate}
                    disabled={deletePending || !!employmentEditId}
                    isOnlyEmployment={isOnlyEmployment}
                />
            </div>
        </>
    );
};

export default SettingsEmploymentStatic;
