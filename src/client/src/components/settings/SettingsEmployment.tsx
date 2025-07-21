import { useLoaderData } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import SettingsContractRow from "./SettingsContractRow";
import { Contract } from "../../../../../types/commonTypes";
import { Dispatch, SetStateAction, useReducer } from "react";
import { Employment } from "../../../../../types/lookupTypes";
import employmentReducer from "../../reducers/employmentReducer";
import SettingsContractRowEdit from "./SettingsContractRowEdit";

const SettingsEmployment = ({
    employment,
    contractEditId,
    setContractEditId,
    employmentEditId,
    setEmploymentEditId,
}: {
    employment: Employment;
    contractEditId: Contract["id"] | null;
    setContractEditId: Dispatch<SetStateAction<Contract["id"] | null>>;
    employmentEditId: Employment["id"] | null;
    setEmploymentEditId: Dispatch<SetStateAction<Employment["id"] | null>>;
}) => {
    const { contracts } = useLoaderData({
        from: "/_private/_table/settings",
    });
    const [employmentContracts, setEmploymentContracts] = useReducer(
        employmentReducer,
        contracts.filter((x: Contract) => x.employment_id === employment.id)
    );
    return (
        <div className="py-3">
            <h3 className="px-3">{employment.name}</h3>
            <Table striped={true} hover={true} responsive={true}>
                <thead>
                    <tr>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Pay band</th>
                        <th scope="col">HCA type</th>
                        <th scope="col">Weekly hours</th>
                        <th scope="col">Pension %</th>
                        <th scope="col">Personal allowance</th>
                        <th scope="col">Student loan</th>
                    </tr>
                </thead>
                <tbody>
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
                                onClick={() => {
                                    setEmploymentEditId(employment.id);
                                    setContractEditId(x.id);
                                }}
                            />
                        )
                    )}
                </tbody>
            </Table>
            <Button
                className="ms-3"
                variant="success"
                disabled={
                    !!employmentEditId && employmentEditId !== employment.id
                }
                onClick={() => {
                    if (contractEditId !== null) {
                        console.log("Saving");
                        setContractEditId(null);
                        setEmploymentEditId(null);
                    } else {
                        setContractEditId(0);
                        setEmploymentEditId(employment.id);
                        setEmploymentContracts({
                            action: "addContract",
                            payload: {
                                employmentId: employment.id,
                                employmentName: employment.name,
                            },
                        });
                    }
                }}
            >
                {contractEditId === null || employmentEditId !== employment.id
                    ? "Add contract"
                    : "Save"}
            </Button>
        </div>
    );
};

export default SettingsEmployment;
