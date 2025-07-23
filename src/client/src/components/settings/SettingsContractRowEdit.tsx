import { useLoaderData } from "@tanstack/react-router";
import { filterOptionsByDate } from "../../../../shared/utils/lookup";
import {
    Contract,
    EmploymentReducerContractKeys,
} from "../../../../../types/commonTypes";
import { Button, Form } from "react-bootstrap";
import { ActionDispatch, ChangeEvent } from "react";
import { EmploymentReducerOptions } from "../../reducers/employmentReducer";
import { roundTo } from "round-to";
import allowFirstFromAndLastTo from "../../reducers/allowFirstFromAndLastTo";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
import IconWrap from "../common/IconWrap";

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

    const changeHandler = (
        e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLSelectElement>
    ) => {
        setEmploymentContracts({
            action: e.currentTarget.dataset
                .field as EmploymentReducerContractKeys,
            payload: {
                newValue: e.currentTarget.value,
                currentContractId: contract.id,
            },
        });
    };

    const { allowFirstFrom, allowLastTo } = allowFirstFromAndLastTo(
        contract.employment_id
    );

    return (
        <tr>
            <td>
                <Form.Control
                    type="date"
                    size="sm"
                    value={contract.from || ""}
                    disabled={first && !allowFirstFrom}
                    onChange={(e) =>
                        setEmploymentContracts({
                            action: "from",
                            payload: {
                                currentContractId: contract.id,
                                newDate: e.currentTarget.value,
                                employmentId: contract.employment_id,
                                employmentName: contract.employment_name,
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
                    disabled={last && !allowLastTo}
                    onChange={(e) =>
                        setEmploymentContracts({
                            action: "to",
                            payload: {
                                currentContractId: contract.id,
                                newDate: e.currentTarget.value,
                                employmentId: contract.employment_id,
                                employmentName: contract.employment_name,
                            },
                        })
                    }
                />
            </td>
            <td>
                <Form.Select
                    disabled={filteredPayBands.length <= 1}
                    size="sm"
                    data-field={"pay_group_id"}
                    value={contract.pay_group_id}
                    onChange={changeHandler}
                >
                    {filteredPayBands.map((x) => (
                        <option key={x.group_id} value={x.group_id}>
                            {x.label}
                        </option>
                    ))}
                </Form.Select>
            </td>
            <td>
                <Form.Select
                    size="sm"
                    data-field={"hca_group_id"}
                    value={contract.hca_group_id || ""}
                    onChange={changeHandler}
                >
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
                    data-field={"weekly_hours"}
                    value={contract.weekly_hours}
                    onChange={changeHandler}
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
                    data-field={"pension_perc"}
                    value={roundTo(contract.pension_perc * 100, 2)}
                    onChange={changeHandler}
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
                    data-field={"personal_allowance"}
                    value={contract.personal_allowance}
                    onChange={changeHandler}
                />
            </td>
            <td>
                <Form.Select
                    size="sm"
                    data-field={"student_loan"}
                    value={contract.student_loan || ""}
                    onChange={changeHandler}
                >
                    <option value={""}>None</option>
                    <option value={"1"}>1</option>
                    <option value={"2"}>2</option>
                    <option value={"4"}>4</option>
                    <option value={"5"}>5</option>
                    <option value={"6"}>Postgrad</option>
                </Form.Select>
            </td>
            <td className="d-flex column-gap-1">
                {!first && (
                    <Button
                        variant="warning"
                        size="sm"
                        className="d-flex align-items-center justify-content-center"
                    >
                        <IconWrap variant="white" width={"1.5rem"} as="span">
                            <IoChevronUp />
                        </IconWrap>
                    </Button>
                )}
                {!last && (
                    <Button
                        variant="warning"
                        size="sm"
                        className="d-flex align-items-center justify-content-center"
                    >
                        <IconWrap variant="white" width={"1.5rem"} as="span">
                            <IoChevronDown />
                        </IconWrap>
                    </Button>
                )}
                {!(first && last) && (
                    <Button
                        variant="danger"
                        size="sm"
                        className="d-flex align-items-center justify-content-center"
                    >
                        <IconWrap variant="white" width={"1.5rem"} as="span">
                            <IoClose />
                        </IconWrap>
                    </Button>
                )}
            </td>
        </tr>
    );
};

export default SettingsContractRowEdit;
