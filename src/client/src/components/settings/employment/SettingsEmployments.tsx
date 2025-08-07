import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getEmploymentsQueryOptions,
    postEmploymentMutationOptions,
} from "../../../queries/employmentQueries";
import { getContractsQueryOptions } from "../../../queries/contractQueries";
import { useState } from "react";
import { Employment } from "../../../../../../types/lookupTypes";
import SettingsEmployment from "./SettingsEmployment";
import { Contract } from "../../../../../../types/commonTypes";
import { Button } from "react-bootstrap";
import { toast } from "react-hot-toast";

const SettingsEmployments = () => {
    const { data: employmentsData } = useQuery(getEmploymentsQueryOptions);
    const { data: contractsData } = useQuery(getContractsQueryOptions);
    const [employmentEditId, setEmploymentEditId] = useState<
        Employment["id"] | null
    >(null);
    const { mutateAsync, isPending } = useMutation({
        ...postEmploymentMutationOptions(),
    });
    return (
        <>
            <div className="pt-3 px-3">
                <h2>Employments</h2>
            </div>
            {(employmentsData?.data || []).map((employment) => (
                <SettingsEmployment
                    key={employment.id}
                    employment={employment}
                    filteredContracts={(contractsData?.data || []).filter(
                        (c: Contract) => c.employment_id === employment.id
                    )}
                    employmentEditId={employmentEditId}
                    setEmploymentEditId={setEmploymentEditId}
                    isOnlyEmployment={(employmentsData?.data || []).length <= 1}
                />
            ))}
            <Button
                className="ms-3"
                variant="success"
                disabled={isPending || !!employmentEditId}
                onClick={async () => {
                    try {
                        await mutateAsync();
                    } catch (_e) {
                        toast.error("Unable to create employment");
                    }
                }}
            >
                Add employment
            </Button>
        </>
    );
};

export default SettingsEmployments;
