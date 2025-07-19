import { useLoaderData } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import SettingsContractRow from "./SettingsContractRow";
import { Contract } from "../../../../../types/commonTypes";
import { useReducer, useState } from "react";
import { filterOptionsByDate } from "../../../../shared/utils/lookup";
import { Employment } from "../../../../../types/lookupTypes";
import employmentReducer from "../../reducers/employmentReducer";
import SettingsContractRowEdit from "./SettingsContractRowEdit";

const SettingsEmployment = ({ employment }: { employment: Employment }) => {
    const { contracts } = useLoaderData({
        from: "/_private/_table/settings",
    });
    const [employmentContracts, setEmploymentContracts] = useReducer(
        employmentReducer,
        contracts.filter((x: Contract) => x.employment_id === employment.id)
    );
    const [editId, setEditId] = useState<number | null>(null);
    const { payBands } = useLoaderData({
        from: "/_private",
    });
    const filteredPayBands = filterOptionsByDate(payBands, new Date());
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
                        editId === x.id ? (
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
                                onClick={() => setEditId(x.id)}
                            />
                        )
                    )}
                </tbody>
            </Table>
            <Button
                className="ms-3"
                variant="success"
                onClick={() => {
                    if (editId !== null) {
                        console.log("Saving");
                        setEditId(null);
                    } else {
                        setEditId(0);
                        setEmploymentContracts({
                            action: "addContract",
                            payload: { employment, filteredPayBands },
                        });
                    }
                }}
            >
                {editId === null ? "Add row" : "Save"}
            </Button>
        </div>
    );
};

export default SettingsEmployment;
