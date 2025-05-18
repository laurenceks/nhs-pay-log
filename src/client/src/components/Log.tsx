import LogTable from "./LogTable.tsx";
import ShiftEditModal from "./ShiftEditModal.tsx";
import { useState } from "react";
import { ShiftEditModalState } from "../../../../types/commonTypes";
import { Button } from "react-bootstrap";
import { formatDate } from "../../../shared/formatDates.ts";
import mockLogData from "../../../../tests/data/mockLogData.ts";

const Log = () => {
    const [logState, setLogState] = useState(mockLogData);
    const [modalState, setModalState] = useState<ShiftEditModalState>({
        show: false,
        shift: null,
    });
    return (
        <div className="m-3 position-relative">
            <LogTable setModalState={setModalState} log={logState} />
            <ShiftEditModal
                modalState={modalState}
                setModalState={setModalState}
                log={logState}
                setLogState={setLogState}
            />
            <Button
                variant="success"
                className="position-fixed bottom-0 start-0 m-5"
                size="lg"
                disabled={!!modalState.shift}
                onClick={() =>
                    setModalState({
                        show: true,
                        shift: {
                            id: "",
                            date: formatDate(new Date(), "yyyy-mm-dd"),
                            start: "",
                            plannedEnd: "",
                            actualEnd: "",
                            from: "",
                            plannedTo: "",
                            actualTo: "",
                            employment: "",
                            type: "Normal",
                            overrunType: "OT",
                            toil: 0,
                            flat: 0,
                            lowerRate: 0,
                            timeAndHalf: 0,
                            higherRate: 0,
                            double: 0,
                        },
                    })
                }
            >
                Add
            </Button>
        </div>
    );
};

export default Log;
