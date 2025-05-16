import { Button, Form, Modal } from "react-bootstrap";
import { ShiftEditModalState } from "../../../../types/commonTypes";
import {
    Dispatch,
    SetStateAction,
    useEffect,
    useReducer,
    useState,
} from "react";
import { calculateUsh } from "../../../shared/ush.ts";
import { calculateAdditionalHours } from "../../../shared/additionalHours.ts";
import ShiftEditModalCalculation from "./ShiftEditModalCalculation.tsx";
import mockLogData from "../../../../tests/data/mockLogData.ts";
import logShiftReducer from "../reducers/logShiftReducer.ts";

const ShiftEditModal = ({
    state: { show, shift },
    setState,
}: {
    state: ShiftEditModalState;
    setState: Dispatch<SetStateAction<ShiftEditModalState>>;
}) => {
    const [editState, setEditState] = useReducer(
        logShiftReducer,
        shift || null
    );
    const [ushState, setUshState] = useState({
        toil: 0,
        lowerRate: 0,
        higherRate: 0,
        flat: 0,
        timeAndHalf: 0,
        double: 0,
    });
    useEffect(() => {
        if (!show && !shift) {
            setEditState({ action: "clear" });
        } else if (shift) {
            setEditState({ action: "set", payload: shift });
        }
    }, [show, shift]);

    const changeHandler = (e) => {
        setEditState({
            action: e.target.dataset.field,
            payload: e.target.value,
        });
    };

    useEffect(() => {
        if (editState) {
            const additionalHours = calculateAdditionalHours(
                editState,
                mockLogData
            );
            setUshState({
                ...calculateUsh(
                    editState.from,
                    editState.overrunType === "OT"
                        ? editState.actualTo
                        : editState.plannedTo,
                    additionalHours.timeAndHalf + additionalHours.double
                ),
                ...additionalHours,
            });
        } else {
            setUshState({
                lowerRate: 0,
                higherRate: 0,
                double: 0,
                flat: 0,
                toil: 0,
                timeAndHalf: 0,
            });
        }
    }, [editState]);

    return (
        <Modal
            show={show}
            onExited={() => {
                setState({ show: false, shift: null });
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
                                    value={editState?.plannedEnd}
                                    data-field={"plannedEnd"}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                            <Form.Group controlId="editActualEnd">
                                <Form.Label>Actual end</Form.Label>
                                <Form.Control
                                    type="time"
                                    placeholder=""
                                    value={editState?.actualEnd}
                                    data-field={"actualEnd"}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            <Form.Group controlId="editEmployment">
                                <Form.Label>Employment</Form.Label>
                                <Form.Select
                                    value={editState?.employment}
                                    data-field={"employment"}
                                    onChange={changeHandler}
                                >
                                    <>
                                        {!editState?.employment && (
                                            <option>
                                                Pick an employment type
                                            </option>
                                        )}
                                    </>
                                    <option value={"SECAmb"}>SECAmb</option>
                                    <option value={"SCAS"}>SCAS</option>
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
                                    value={editState?.overrunType}
                                    data-field={"overrunType"}
                                    onChange={changeHandler}
                                >
                                    <>
                                        {!editState?.employment && (
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
                    </Form>
                    <div className="d-flex flex-wrap">
                        <ShiftEditModalCalculation
                            label="TOIL"
                            value={ushState.toil}
                        />
                        <ShiftEditModalCalculation
                            label="Lower rate"
                            value={ushState.lowerRate}
                        />
                        <ShiftEditModalCalculation
                            label="Higher rate"
                            value={ushState.higherRate}
                        />
                        <ShiftEditModalCalculation
                            label="Flat"
                            value={ushState.flat}
                        />
                        <ShiftEditModalCalculation
                            label="Time and a half"
                            value={ushState.timeAndHalf}
                        />
                        <ShiftEditModalCalculation
                            label="Double"
                            value={ushState.double}
                        />
                        <ShiftEditModalCalculation
                            label="Extra pay"
                            value={0}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() =>
                        setState((prevState) => {
                            return { ...prevState, show: false };
                        })
                    }
                    variant="warning"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() =>
                        setState((prevState) => {
                            return { ...prevState, show: false };
                        })
                    }
                    variant="success"
                >
                    Save changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShiftEditModal;
