import { Contract } from "../../../../../../types/commonTypes";
import { Dispatch, SetStateAction, useReducer, useState } from "react";
import { Employment } from "../../../../../../types/lookupTypes";
import employmentReducer from "../../../reducers/employmentReducer";
import { useMutation } from "@tanstack/react-query";
import { deleteEmploymentMutationOptions } from "../../../queries/employmentQueries";
import SettingsEmploymentEdit from "./SettingsEmploymentEdit";
import SettingsEmploymentStatic from "./SettingsEmploymentStatic";

const SettingsEmployment = ({
    employment,
    filteredContracts,
    employmentEditId,
    setEmploymentEditId,
    isOnlyEmployment,
}: {
    employment: Employment;
    filteredContracts: Contract[];
    employmentEditId: Employment["id"] | null;
    setEmploymentEditId: Dispatch<SetStateAction<Employment["id"] | null>>;
    isOnlyEmployment: boolean;
}) => {
    const [contractEditId, setContractEditId] = useState<Contract["id"] | null>(
        null
    );
    const [employmentContracts, setEmploymentContracts] = useReducer(
        employmentReducer,
        filteredContracts
    );

    const { mutateAsync: deleteMutate, isPending: deletePending } = useMutation(
        {
            ...deleteEmploymentMutationOptions(employment.id),
        }
    );

    return (
        <div className="py-3">
            {employment.id === employmentEditId ? (
                <SettingsEmploymentEdit
                    employment={employment}
                    setEmploymentEditId={setEmploymentEditId}
                    isOnlyEmployment={isOnlyEmployment}
                    setEmploymentContracts={setEmploymentContracts}
                    setContractEditId={setContractEditId}
                    contractEditId={contractEditId}
                    employmentContracts={employmentContracts}
                    deletePending={deletePending}
                    deleteMutate={deleteMutate}
                    filteredContracts={filteredContracts}
                />
            ) : (
                <SettingsEmploymentStatic
                    employment={employment}
                    employmentContracts={employmentContracts}
                    contractEditId={contractEditId}
                    setEmploymentEditId={setEmploymentEditId}
                    isOnlyEmployment={isOnlyEmployment}
                    deleteMutate={deleteMutate}
                    deletePending={deletePending}
                />
            )}
        </div>
    );
};

export default SettingsEmployment;
