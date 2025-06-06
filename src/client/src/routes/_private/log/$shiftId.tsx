import { createFileRoute, redirect } from "@tanstack/react-router";
import ShiftEditModal from "../../../components/shiftEdit/ShiftEditModal";
import mockLogData from "../../../../../../tests/data/mockLogData";
import { formatDate } from "../../../../../shared/utils/formatDates";
import { LogShift } from "../../../../../../types/commonTypes";
import { filterOptionsByDate } from "../../../../../shared/utils/lookup";
import mockEmploymentTable from "../../../../../../tests/data/mockEmploymentTable";

const createShift = () => {
    const today = formatDate(new Date(), "yyyy-mm-dd");
    const employmentSelectOptions = filterOptionsByDate<
        (typeof mockEmploymentTable)[0]
    >(mockEmploymentTable, today);
    employmentSelectOptions.length === 1
        ? employmentSelectOptions[0].employment_id
        : "";

    return {
        actual_end: "",
        actual_to: "",
        date: today,
        double: 0,
        employment_id:
            employmentSelectOptions.length === 1
                ? employmentSelectOptions[0].employment_id
                : "",
        extras: [],
        flat: 0,
        from: "",
        higher_rate: 0,
        id: "",
        lower_rate: 0,
        overrun_type: "OT",
        planned_end: "",
        planned_to: "",
        start: "",
        time_and_half: 0,
        toil: 0,
        type: "Normal",
    } as LogShift;
};

export const Route = createFileRoute("/_private/log/$shiftId")({
    component: ShiftEditModal,
    loader: async ({ params }): Promise<LogShift> => {
        if (params.shiftId === "new") {
            return createShift();
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
