import { useNavigate } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
import SettingsEmployment from "./SettingsEmployment";
import { useState } from "react";
import { Employment } from "../../../../../types/lookupTypes";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getEmploymentsQueryOptions,
    postEmploymentMutationOptions,
} from "../../queries/employmentQueries";
import { toast } from "react-hot-toast";
import { getContractsQueryOptions } from "../../queries/contractQueries";
import { Contract } from "../../../../../types/commonTypes";

const Settings = () => {
    const navigate = useNavigate();
    const { data: employmentsData } = useQuery(getEmploymentsQueryOptions);
    const { data: contractsData } = useQuery(getContractsQueryOptions);
    const [employmentEditId, setEmploymentEditId] = useState<
        Employment["id"] | null
    >(null);
    const { mutateAsync, isPending } = useMutation({
        ...postEmploymentMutationOptions(),
    });
    return (
        <div>
            <div className="pt-3 px-3">
                <h1>User settings</h1>
                <h2>Employments</h2>
            </div>
            {(employmentsData?.data || []).map((employment) => (
                <SettingsEmployment
                    key={employment.id}
                    employment={employment}
                    contracts={(contractsData?.data || []).filter(
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
                disabled={isPending}
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
            <div className="ms-4 my-3 d-flex gap-3">
                <Button
                    variant="secondary"
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    Home
                </Button>
            </div>
        </div>
    );
};

export default Settings;
