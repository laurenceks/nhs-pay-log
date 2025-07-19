import { useLoaderData } from "@tanstack/react-router";
import { filterOptionsByDate } from "../../../../shared/utils/lookup";
import { Contract } from "../../../../../types/commonTypes";
import { Form } from "react-bootstrap";
import { ActionDispatch } from "react";
import { EmploymentReducerOptions } from "../../reducers/employmentReducer";

const SettingsContractRowEdit = ({
    contract,
    setEmploymentContracts,
    first,
    last,
}: {
    contract: Contract;
    setEmploymentContracts: ActionDispatch<[EmploymentReducerOptions]>;
    first: boolean;
    last: boolean;
}) => {
    const { payBands } = useLoaderData({
        from: "/_private",
    });
    const filteredPayBands = filterOptionsByDate(
        payBands,
        contract.from || contract.to || ""
    );

    return (
        <tr
            style={{
                cursor: "pointer",
            }}
        >
            <td>
                <Form.Control
                    type="date"
                    size="sm"
                    value={contract.from || ""}
                    disabled={first}
                    onChange={(e) =>
                        setEmploymentContracts({
                            action: "from",
                            payload: {
                                currentContractId: contract.id,
                                newDate: e.currentTarget.value,
                            },
                        })
                    }
                />
            </td>
            <td>
                <Form.Control
                    type="date"
                    size="sm"
                    value={contract.to || ""}
                    disabled={last}
                    onChange={(e) =>
                        setEmploymentContracts({
                            action: "to",
                            payload: {
                                currentContractId: contract.id,
                                newDate: e.currentTarget.value,
                            },
                        })
                    }
                />
            </td>
            <td>
                <Form.Select disabled={filteredPayBands.length <= 1} size="sm">
                    {filteredPayBands.map((x) => (
                        <option key={x.group_id} value={x.group_id}>
                            {x.label}
                        </option>
                    ))}
                </Form.Select>
            </td>
            <td>
                <Form.Select size="sm" value={contract.hca_group_id || ""}>
                    <option value={""}>None</option>
                    <option value={"3"}>Fringe</option>
                    <option value={"2"}>Outer London</option>
                    <option value={"1"}>Inner London</option>
                </Form.Select>
            </td>
            <td>
                <Form.Control
                    size="sm"
                    type="number"
                    max={37.5}
                    min={0}
                    step={0.01}
                    placeholder="37.5"
                    value={contract.weekly_hours}
                />
            </td>
            <td>
                <Form.Control
                    size="sm"
                    type="number"
                    max={100}
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={contract.pension_perc * 100}
                />
            </td>
            <td>
                <Form.Control
                    size="sm"
                    type="number"
                    max={999999}
                    min={0}
                    step={1}
                    placeholder="0"
                    value={contract.personal_allowance}
                />
            </td>
            <td>
                <Form.Select size="sm" value={contract.student_loan || ""}>
                    <option value={""}>None</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                    <option value={"6"}>Postgrad</option>
                </Form.Select>
            </td>
        </tr>
    );
};

export default SettingsContractRowEdit;
