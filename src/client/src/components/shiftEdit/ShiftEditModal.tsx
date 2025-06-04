import { Button, Form, Modal } from "react-bootstrap";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { calculateUsh } from "../../../shared/calculations/ush.ts";
import { calculateAdditionalHours } from "../../../shared/calculations/additionalHours.ts";
import ShiftEditModalCalculation from "./ShiftEditModalCalculation.tsx";
import logShiftReducer from "../reducers/logShiftReducer.ts";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import {
    CalculatedHours,
    LogShift,
    ShiftExtra,
} from "../../../../types/commonTypes";
import calculateExtraPay from "../../../shared/calculations/calculateExtraPay.ts";
import { filterOptionsByDate } from "../../../shared/utils/lookup.ts";
import mockEmploymentLookup from "../../../../tests/data/mockEmploymentLookup.ts";
import { Typeahead } from "react-bootstrap-typeahead";
import mockExtrasLookup from "../../../../tests/data/mockExtrasLookup.ts";

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
        (typeof mockEmploymentLookup)[0]
    >(mockEmploymentLookup, editState.date);

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
                | "plannedEndBlur",
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
                <Modal.Title>Edit shift</Modal.Title>
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
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            <Form.Group controlId="editExtras">
                                <Form.Label>Extras</Form.Label>
                                <Typeahead
                                    options={filterOptionsByDate<
                                        (typeof mockExtrasLookup)[0]
                                    >(mockExtrasLookup, editState.date)}
                                    multiple
                                    selected={mockExtrasLookup.filter((x) =>
                                        editState.extras.includes(x.id)
                                    )}
                                    onChange={(e) =>
                                        setEditState({
                                            action: "extras",
                                            payload: e as ShiftExtra[],
                                        })
                                    }
                                    labelKey={"name"}
                                />
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
