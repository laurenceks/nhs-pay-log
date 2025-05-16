import LogTable from "./LogTable.tsx";
import ShiftEditModal from "./ShiftEditModal.tsx";
import { useState } from "react";
import { ShiftEditModalState } from "../../../../types/commonTypes";

const Log = () => {
    const [modalState, setModalState] = useState<ShiftEditModalState>({
        show: false,
        shift: null,
    });
    return (
        <div className="m-3">
            <LogTable setModalState={setModalState} />
            <ShiftEditModal state={modalState} setState={setModalState} />
        </div>
    );
};

export default Log;
