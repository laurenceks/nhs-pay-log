import { Button, Form, Table } from "react-bootstrap";
import SettingsContractRow from "./contractRow/SettingsContractRow";
import { Contract } from "../../../../../../types/commonTypes";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { Employment } from "../../../../../../types/lookupTypes";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import SettingsEmploymentThead from "./common/SettingsEmploymentThead";
import SettingsEmploymentDeleteButton from "./common/SettingsEmploymentDeleteButton";
import { toast } from "react-hot-toast";
import { useRouteContext } from "@tanstack/react-router";
import { formatDate } from "../../../../../shared/utils/formatDates";

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
    const { auth } = useRouteContext({ strict: false });
    const [reportPending, startTransition] = useTransition();
    const [useDecimals, setUseDecimals] = useState(false);
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
                <Button
                    variant="outline-primary"
                    disabled={
                        deletePending || !!employmentEditId || reportPending
                    }
                    onClick={() =>
                        startTransition(async () => {
                            const res = await fetch(
                                `/api/v1/private/employment/${employment.id}/report${useDecimals ? "?useDecimals=1" : ""}`
                            );

                            if (!res.ok) {
                                if (res.status === 401 || res.status === 403) {
                                    //force reload to login page
                                    window.localStorage.setItem(
                                        "redirect",
                                        window.location.pathname +
                                            window.location.hash +
                                            window.location.search
                                    );
                                    window.location.href = "/login";
                                    //stall logic to prevent error registering before the redirect
                                    return new Promise(() => {});
                                } else {
                                    toast.error(`Failed to generate report`);
                                }
                            } else {
                                const blob = await res.blob();
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `Section 2 USH for annual leave on relief report${auth?.user ? `for ${auth.user.first_name} ${auth.user.last_name}` : ""} (${formatDate(new Date(), "dd/mm/yy hh:mm")}).pdf`;
                                link.click();

                                URL.revokeObjectURL(url);
                            }
                        })
                    }
                >
                    {reportPending
                        ? "Generating..."
                        : "Generate USH for leave on relief report"}
                </Button>
                <Form.Check
                    className="align-self-center"
                    label={"Use decimal hours"}
                    onChange={(e) => setUseDecimals(e.target.checked)}
                ></Form.Check>
            </div>
        </>
    );
};

export default SettingsEmploymentStatic;
