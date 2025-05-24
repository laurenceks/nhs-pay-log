import { createFileRoute, redirect } from "@tanstack/react-router";
import ShiftEditModal from "../../../components/ShiftEditModal.tsx";
import mockLogData from "../../../../../../tests/data/mockLogData.ts";
import { formatDate } from "../../../../../shared/utils/formatDates.ts";
import { LogShift } from "../../../../../../types/commonTypes";

const blankShift: LogShift = {
    actualEnd: "",
    actualTo: "",
    date: formatDate(new Date(), "yyyy-mm-dd"),
    double: 0,
    employment: "",
    extras: [],
    flat: 0,
    from: "",
    higherRate: 0,
    id: "",
    lowerRate: 0,
    overrunType: "OT",
    plannedEnd: "",
    plannedTo: "",
    start: "",
    timeAndHalf: 0,
    toil: 0,
    type: "Normal",
};
export const Route = createFileRoute("/_private/log/$shiftId")({
    component: ShiftEditModal,
    loader: async ({ params }): Promise<LogShift> => {
        if (params.shiftId === "new") {
            return blankShift;
        }
        console.log("Fetching shift...");
        await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 125)
        );
        console.log("...done!");
        const foundShift = mockLogData.find((x) => x.id === params.shiftId);
        if (!foundShift) {
            throw new Error("Shift not found");
        }
        return foundShift;
    },
    onError: () => {
        throw redirect({ to: ".." });
    },
});
