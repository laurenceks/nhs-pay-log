import { Button, Form, Modal } from "react-bootstrap";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { calculateUsh } from "../../../../shared/calculations/ush";
import { calculateAdditionalHours } from "../../../../shared/calculations/additionalHours";
import ShiftEditModalCalculation from "./ShiftEditModalCalculation";
import logShiftReducer from "../../reducers/logShiftReducer";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import {
    CalculatedHours,
    LogShift,
    ShiftExtra,
} from "../../../../../types/commonTypes";
import calculateExtraPay from "../../../../shared/calculations/calculateExtraPay";
import { filterOptionsByDate } from "../../../../shared/utils/lookup";
import mockEmploymentTable from "../../../../../tests/data/mockEmploymentTable";
import { Typeahead } from "react-bootstrap-typeahead";
import mockExtrasLookup from "../../../../../tests/data/mockExtrasLookup";
import { FiX } from "react-icons/fi";
import mockPayTable from "../../../../../tests/data/mockPayTable";

const ShiftEditModal = () => {
    const navigate = useNavigate();
    const log: LogShift[] = useLoaderData({ from: "/_private/log" });
    const shift = useLoaderData({ from: "/_private/log/$shiftId" });
    const [show, setShow] = useState<boolean>(true);
    const [editState, setEditState] = useReducer(
        logShiftReducer,
        shift as LogShift
    );
    const [ushState, setUshState] = useState<CalculatedHours>({
        toil: 0,
        lower_rate: 0,
        higher_rate: 0,
        flat: 0,
        time_and_half: 0,
        double: 0,
    });

    const employmentSelectOptions = filterOptionsByDate<
        (typeof mockEmploymentTable)[0]
    >(mockEmploymentTable, editState.date);

    const selectedExtras = mockExtrasLookup.filter((x) =>
        editState.extras.includes(x.id)
    );

    const closeModal = () => {
        setShow(false);
    };
    const saveEdit = () => {
        closeModal();
    };
    /*
    useEffect(() => {
        if (!show && !shift) {
            setEditState({ action: "clear" });
        } else if (shift) {
            setEditState({ action: "set", payload: shift });
        }
    }, [show, shift]);
*/

    const changeHandler = (
        e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLSelectElement>
    ) => {
        setEditState({
            action: e.currentTarget.dataset.field as
                | "actualEnd"
                | "date"
                | "employment_id"
                | "plannedEnd"
                | "start"
                | "plannedEndBlur"
                | "payIdOverride",
            payload: e.currentTarget.value,
        });
    };

    useEffect(() => {
        if (editState) {
            const additionalHours = calculateAdditionalHours(editState, log);
            setUshState({
                ...calculateUsh(
                    editState.from,
                    editState.overrun_type === "OT"
                        ? editState.actual_to
                        : editState.planned_to,
                    editState.type,
                    additionalHours.time_and_half + additionalHours.double
                ),
                ...additionalHours,
            });
        } else {
            setUshState({
                lower_rate: 0,
                higher_rate: 0,
                double: 0,
                flat: 0,
                toil: 0,
                time_and_half: 0,
            });
        }
    }, [editState]);

    return (
        <Modal
            show={show}
            onExited={() => {
                navigate({ to: "/log" });
                // setModalState({ show: false, shift: null });
            }}
            size="lg"
            fullscreen={"lg-down"}
        >
            <Modal.Header>
                <Modal.Title>{editState.id ? "Edit" : "Add"} shift</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <Form className="d-flex flex-wrap gap-3">
                        <div className="d-flex flex-wrap gap-3">
                            <Form.Group controlId="editDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    placeholder=""
                                    value={editState?.date}
                                    data-field={"date"}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group controlId="editStart">
                                <Form.Label>Start</Form.Label>
                                <Form.Control
                                    type="time"
                                    placeholder=""
                                    value={editState?.start}
                                    data-field={"start"}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group controlId="editPlannedEnd">
                                <Form.Label>Planned end</Form.Label>
                                <Form.Control
                                    type="time"
                                    placeholder=""
                                    value={editState?.planned_end}
                                    data-field={"plannedEnd"}
                                    onChange={changeHandler}
                                    onBlur={(e) => {
                                        setEditState({
                                            action: "plannedEndBlur",
                                            payload: e.currentTarget.value,
                                        });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="editActualEnd">
                                <Form.Label>Actual end</Form.Label>
                                <Form.Control
                                    type="time"
                                    placeholder=""
                                    value={editState?.actual_end}
                                    data-field={"actualEnd"}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            <Form.Group controlId="editEmployment">
                                <Form.Label>Employment</Form.Label>
                                <Form.Select
                                    value={editState?.employment_id}
                                    data-field={"employment_id"}
                                    onChange={changeHandler}
                                    disabled={
                                        employmentSelectOptions.length <= 1
                                    }
                                >
                                    <>
                                        {!editState?.employment_id && (
                                            <option>
                                                Pick an employment type
                                            </option>
                                        )}
                                    </>
                                    {employmentSelectOptions.map((x) => (
                                        <option
                                            key={x.employment_id}
                                            value={x.employment_id}
                                        >
                                            {x.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="editType">
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    value={editState?.type}
                                    data-field={"type"}
                                    onChange={changeHandler}
                                >
                                    <>
                                        {!editState?.type && (
                                            <option>Pick a shift type</option>
                                        )}
                                    </>
                                    <option value={"Normal"}>Normal</option>
                                    <option value={"OT"}>OT</option>
                                    <option value={"Bank"}>Bank</option>
                                    <option value={"TOIL"}>TOIL</option>
                                    <option value={"AL"}>AL</option>
                                    <option value={"AL (relief)"}>
                                        AL (relief)
                                    </option>
                                    <option value={"Absent (TOIL)"}>
                                        Absent (TOIL)
                                    </option>
                                    <option value={"Absent (TOIL relief)"}>
                                        Absent (TOIL relief)
                                    </option>
                                    <option value={"Sick"}>Sick</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="editOverrunType">
                                <Form.Label>Overrun type</Form.Label>
                                <Form.Select
                                    value={editState?.overrun_type}
                                    data-field={"overrunType"}
                                    onChange={changeHandler}
                                >
                                    <>
                                        {!editState?.employment_id && (
                                            <option>
                                                Pick an overrun type
                                            </option>
                                        )}
                                    </>
                                    <option value={"OT"}>OT</option>
                                    <option value={"TOIL"}>TOIL</option>
                                </Form.Select>
                            </Form.Group>
                            {!!Object.keys(mockPayTable).length && (
                                <Form.Group controlId="editPayIdOverride">
                                    <Form.Label>Pay override</Form.Label>
                                    <Form.Select
                                        value={editState?.pay_id_override || ""}
                                        data-field={"payIdOverride"}
                                        onChange={changeHandler}
                                        disabled={
                                            !Object.keys(mockPayTable).length
                                        }
                                    >
                                        <option value={""}>
                                            None (default pay)
                                        </option>
                                        {Object.keys(mockPayTable).map((x) => (
                                            <option key={x} value={x}>
                                                {mockPayTable[x].label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}
                        </div>
                        <div className="d-flex flex-wrap gap-3 w-100">
                            <Form.Group controlId="editExtras">
                                <Form.Label>Extras</Form.Label>
                                <div className="d-flex gap-3 flex-wrap flex-md-fill">
                                    <Typeahead
                                        options={filterOptionsByDate<
                                            (typeof mockExtrasLookup)[0]
                                        >(mockExtrasLookup, editState.date)}
                                        multiple
                                        selected={selectedExtras}
                                        onChange={(e) =>
                                            setEditState({
                                                action: "addExtra",
                                                payload: e as ShiftExtra[],
                                            })
                                        }
                                        labelKey={"name"}
                                        renderToken={() => null}
                                        className="flex-shrink-0"
                                    />
                                    <div className="d-flex flex-wrap gap-1">
                                        {selectedExtras.map((x) => (
                                            <Button
                                                key={x.id}
                                                variant="outline-light"
                                                size="sm"
                                                className="d-flex align-items-center gap-1 h-auto"
                                                onClick={() =>
                                                    setEditState({
                                                        action: "removeExtra",
                                                        payload: x.id,
                                                    })
                                                }
                                            >
                                                {x.name} (
                                                {x.value.toLocaleString(
                                                    "en-GB",
                                                    {
                                                        style: "currency",
                                                        currency: "GBP",
                                                    }
                                                )}
                                                )
                                                <span
                                                    className="d-inline-flex justify-content-center align-items-center bg-light text-dark rounded"
                                                    style={{
                                                        padding: "0.125rem",
                                                    }}
                                                >
                                                    <FiX />
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </Form.Group>
                        </div>
                    </Form>
                    <div className="d-flex flex-wrap">
                        <ShiftEditModalCalculation
                            label="TOIL"
                            value={ushState.toil}
                        />
                        <ShiftEditModalCalculation
                            label="Lower rate"
                            value={ushState.lower_rate}
                        />
                        <ShiftEditModalCalculation
                            label="Higher rate"
                            value={ushState.higher_rate}
                        />
                        <ShiftEditModalCalculation
                            label="Flat"
                            value={ushState.flat}
                        />
                        <ShiftEditModalCalculation
                            label="Time and a half"
                            value={ushState.time_and_half}
                        />
                        <ShiftEditModalCalculation
                            label="Double"
                            value={ushState.double}
                        />
                        <ShiftEditModalCalculation
                            label="Extra pay"
                            value={calculateExtraPay({
                                ...editState,
                                ...ushState,
                            })}
                            currency
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {editState?.id && (
                    <>
                        <Button
                            onClick={() => {
                                console.log("Copying " + editState.id);
                            }}
                            variant="outline-secondary"
                        >
                            Copy
                        </Button>
                        <Button
                            onClick={() => {
                                closeModal();
                            }}
                            variant="danger"
                        >
                            Delete shift
                        </Button>
                    </>
                )}
                <Button onClick={closeModal} variant="warning">
                    Cancel
                </Button>
                <Button onClick={saveEdit} variant="success">
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShiftEditModal;
