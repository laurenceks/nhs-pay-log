import { Button, Form, Modal } from "react-bootstrap";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useReducer,
    useState,
} from "react";
import ShiftEditModalCalculation from "./ShiftEditModalCalculation";
import logShiftReducer from "../../reducers/logShiftReducer";
import { useLoaderData } from "@tanstack/react-router";
import {
    CalculatedHours,
    ClientShift,
    ShiftExtra,
} from "../../../../../types/commonTypes";
import calculateExtraPay from "../../../../shared/calculations/extraPay";
import { Typeahead } from "react-bootstrap-typeahead";
import { FiX } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import {
    patchLogShiftMutationOptions,
    postLogShiftMutationOptions,
} from "../../queries/logQueries";
import { updateShiftContract } from "../../../../shared/utils/updateShiftContract";
import { updateShiftExtras } from "../../../../shared/utils/updateShiftExtras";
import { filterOptionsByDate } from "../../../../shared/utils/lookup";
import { PayBand } from "../../../../../types/lookupTypes";
import { toast } from "react-hot-toast";
import { ApiResponse } from "../../../../../types/responseTypes";
import { logShiftValidationSchema } from "../../../../shared/validationSchemas/logShiftValidationSchema";
import { overrunTypeList, typeList } from "../../../../shared/lists";
import ShiftEditModalListOptions from "./ShiftEditModalListOptions";
import { absentShiftTypes } from "../../../../shared/utils/shiftTypes";
import { calculateSection2 } from "section-2";
import { decimalHoursToMs } from "../../../../shared/utils/conversions";

const ShiftEditModal = ({
    setToastMessage,
    setShowDeleteModal,
    setShow,
}: {
    setToastMessage: Dispatch<SetStateAction<string>>;
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
    setShow: Dispatch<SetStateAction<boolean>>;
}) => {
    const { log, contracts } = useLoaderData({
        from: "/_private/_nav/_table/log",
    });
    const { extras, payBands } = useLoaderData({ from: "/_private" });
    const shift = useLoaderData({
        from: "/_private/_nav/_table/log/$shiftId",
    });

    const { updatedExtras, updatedExtrasGroupIds, filteredExtras } =
        updateShiftExtras(shift.extras_ids_string, extras, shift.date);

    const [editState, setEditState] = useReducer(logShiftReducer, {
        ...shift,
        extras_ids_string: updatedExtrasGroupIds,
        selectedExtras: updatedExtras,
    } as ClientShift);

    const [ushState, setUshState] = useState<CalculatedHours>({
        toil: 0,
        lower_rate: 0,
        higher_rate: 0,
        flat: 0,
        time_and_half: 0,
        double: 0,
        absent_hours: 0,
    });

    const filteredPayBands = filterOptionsByDate<PayBand>(
        payBands,
        editState.date
    );

    const { mutateAsync: mutatePost, isPending: postPending } = useMutation({
        ...postLogShiftMutationOptions({ ...editState, ...ushState }),
    });
    const { mutateAsync: mutatePatch, isPending: patchPending } = useMutation({
        ...patchLogShiftMutationOptions({ ...editState, ...ushState }),
    });

    const [contractValidOnDate, newContract, contractSelectOptions] =
        updateShiftContract(
            editState.contract_id,
            editState.employment_id,
            contracts,
            editState.date
        );

    useEffect(() => {
        if (!contractValidOnDate) {
            if (
                editState.employment_id &&
                newContract?.employment_id !== editState.employment_id
            ) {
                toast.error(
                    "The selected employment is not valid on this date and has been replaced with the best option available",
                    { id: `logShift-${shift.id}-contractChanged` }
                );
            }
            setEditState({
                action: "contract",
                payload: newContract,
            });
        }
        const {
            updatedExtras: newExtras,
            updatedExtrasGroupIds: newExtrasIdsString,
        } = updateShiftExtras(
            editState.extras_ids_string,
            extras,
            editState.date
        );
        if (newExtrasIdsString !== editState.extras_ids_string) {
            toast.error(
                "One or more of the selected extras is not valid on this date and has been removed"
            );
            setEditState({ action: "addExtra", payload: newExtras });
        }
    }, [editState.date]);
    const saveEdit = async () => {
        try {
            await (editState.id ? mutatePatch() : mutatePost());
            setToastMessage("Shift saved");
            setShow(false);
        } catch (e) {
            toast.error(
                (e as ApiResponse).message ||
                    "There was a problem saving the shift, please try again",
                {
                    id: `shift-${shift.id}-save-error`,
                }
            );
        }
    };

    const changeHandler = (
        e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLSelectElement>
    ) => {
        setEditState({
            action: e.currentTarget.dataset.field as
                | "actualEnd"
                | "date"
                | "plannedEnd"
                | "start"
                | "plannedEndBlur"
                | "payIdOverride",
            payload: e.currentTarget.value,
        });
    };

    useEffect(() => {
        if (editState) {
            setUshState({
                ...calculateSection2(
                    {
                        ...editState,
                        shifts: log,
                    },
                    {
                        weekly_hours: decimalHoursToMs(editState.weekly_hours),
                        half_is_all_ush: !!editState.half_is_all_ush,
                        break_from_higher: !!editState.break_from_higher,
                        leave_relief_ush_type: editState.leave_relief_ush_type,
                    }
                ),
            });
        } else {
            setUshState({
                lower_rate: 0,
                higher_rate: 0,
                double: 0,
                flat: 0,
                toil: 0,
                time_and_half: 0,
                absent_hours: 0,
            });
        }
    }, [editState]);

    return (
        <>
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
                            <Form.Group controlId="editBreakOverride">
                                <Form.Label>Break overide</Form.Label>
                                <Form.Control
                                    type="time"
                                    placeholder=""
                                    value={
                                        editState?.break_override_string || ""
                                    }
                                    data-field={"breakOverride"}
                                    onChange={changeHandler}
                                />
                            </Form.Group>
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            <Form.Group controlId="editEmployment">
                                <Form.Label>Contract</Form.Label>
                                <Form.Select
                                    value={editState?.contract_id}
                                    data-field={"contract_id"}
                                    onChange={(e) => {
                                        setEditState({
                                            action: "contract",
                                            payload: contractSelectOptions.find(
                                                (x) =>
                                                    x.id ===
                                                    parseInt(
                                                        e.currentTarget.value,
                                                        10
                                                    )
                                            ),
                                        });
                                    }}
                                    disabled={contractSelectOptions.length <= 1}
                                >
                                    <>
                                        {!editState?.contract_id && (
                                            <option>
                                                Select an employment
                                            </option>
                                        )}
                                    </>
                                    {contractSelectOptions.map((x) => (
                                        <option
                                            key={`contract-${x.id}`}
                                            value={x.id}
                                        >
                                            {`${x.employment_name}`}
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
                                    <ShiftEditModalListOptions
                                        list={typeList}
                                    />
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
                                    <ShiftEditModalListOptions
                                        list={overrunTypeList}
                                    />
                                </Form.Select>
                            </Form.Group>
                            {!!filteredPayBands.length && (
                                <Form.Group controlId="editPayIdOverride">
                                    <Form.Label>Pay override</Form.Label>
                                    <Form.Select
                                        value={editState?.pay_id_override || ""}
                                        data-field={"payIdOverride"}
                                        onChange={changeHandler}
                                        disabled={filteredPayBands.length <= 1}
                                    >
                                        <option value={""}>
                                            None (default pay)
                                        </option>
                                        {filteredPayBands.map((x) => (
                                            <option
                                                key={`${x.group_id}_${x.from}_${x.to}`}
                                                value={x.group_id}
                                            >
                                                {x.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}
                        </div>
                        <div className="w-100 pe-4 me-3">
                            <Form.Group controlId="editNotes">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    type="text"
                                    maxLength={255}
                                    data-field={"notes"}
                                    onChange={changeHandler}
                                    value={editState.notes}
                                ></Form.Control>
                            </Form.Group>
                        </div>
                        <div className="d-flex flex-wrap gap-3 w-100">
                            <Form.Group controlId="editExtras">
                                <Form.Label>Extras</Form.Label>
                                <div className="d-flex gap-3 flex-wrap flex-md-fill">
                                    <Typeahead
                                        options={filteredExtras}
                                        multiple
                                        selected={editState.selectedExtras}
                                        onChange={(e) =>
                                            setEditState({
                                                action: "addExtra",
                                                payload: e as ShiftExtra[],
                                            })
                                        }
                                        renderToken={() => null}
                                        className="flex-shrink-0"
                                    />
                                    <div className="d-flex flex-wrap gap-1">
                                        {editState.selectedExtras?.map((x) => (
                                            <Button
                                                key={x.id}
                                                variant="outline-light"
                                                size="sm"
                                                className="d-flex align-items-center gap-1 h-auto"
                                                onClick={() =>
                                                    setEditState({
                                                        action: "removeExtra",
                                                        payload: x.group_id,
                                                    })
                                                }
                                            >
                                                {x.label} (
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
                            label={
                                absentShiftTypes.includes(editState.type)
                                    ? "Absent"
                                    : "TOIL"
                            }
                            value={
                                absentShiftTypes.includes(editState.type)
                                    ? ushState.absent_hours
                                    : ushState.toil
                            }
                        />
                        {editState.type !== "Sick" && (
                            <>
                                <ShiftEditModalCalculation
                                    label="Lower rate"
                                    value={ushState.lower_rate}
                                />
                                <ShiftEditModalCalculation
                                    label="Higher rate"
                                    value={ushState.higher_rate}
                                />
                            </>
                        )}
                        {!absentShiftTypes.includes(editState.type) && (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {!!editState?.id && (
                    <>
                        <Button
                            disabled={postPending || patchPending}
                            onClick={() => {
                                setEditState({ action: "copy" });
                            }}
                            variant="outline-secondary"
                        >
                            Copy
                        </Button>
                        <Button
                            disabled={postPending || patchPending}
                            onClick={() => {
                                setShowDeleteModal(true);
                            }}
                            variant="danger"
                        >
                            Delete shift
                        </Button>
                    </>
                )}
                <Button
                    disabled={postPending || patchPending}
                    onClick={() => setShow(false)}
                    variant="warning"
                >
                    Cancel
                </Button>
                <Button
                    disabled={
                        postPending ||
                        patchPending ||
                        !logShiftValidationSchema.safeParse({
                            ...editState,
                            ...ushState,
                        }).success
                    }
                    onClick={saveEdit}
                    variant="success"
                >
                    Save changes
                </Button>
            </Modal.Footer>
        </>
    );
};

export default ShiftEditModal;
