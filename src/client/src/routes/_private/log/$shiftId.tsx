import { createFileRoute, redirect } from "@tanstack/react-router";
import ShiftEditModal from "../../../components/shiftEdit/ShiftEditModal";
import { formatDate } from "../../../../../shared/utils/formatDates";
import { LogShift } from "../../../../../../types/commonTypes";
import { filterOptionsByDate } from "../../../../../shared/utils/lookup";
import mockEmploymentTable from "../../../../../../tests/data/mockEmploymentTable";
import { getLogShiftQueryOptions } from "../../../queries/logQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { financialYear } from "../../../../../shared/calculations/payDates";
import { ApiResponse } from "../../../../../../types/responseTypes";

const createShift = () => {
    const today = formatDate(new Date(), "yyyy-mm-dd");
    const employmentSelectOptions = filterOptionsByDate<
        (typeof mockEmploymentTable)[0]
    >(mockEmploymentTable, today);

    return {
        actual_end: "",
        actual_to: "",
        date: today,
        pay_date: formatDate(today, "yyyy-mm-dd"),
        pay_month: formatDate(today, "yy-mm"),
        pay_financial_year: financialYear(today),
        double: 0,
        employment_id:
            employmentSelectOptions.length === 1
                ? employmentSelectOptions[0].id
                : "",
        employment_name:
            employmentSelectOptions.length === 1
                ? employmentSelectOptions[0].name
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
        pay_id_override: null,
    } as LogShift;
};

export const Route = createFileRoute("/_private/log/$shiftId")({
    component: ShiftEditModal,
    loader: async ({ params, context }): Promise<ApiResponse<LogShift>> => {
        if (params.shiftId === "new") {
            return { data: createShift() };
        }
        return await context.queryClient.ensureQueryData(
            stripQueryOptionsForEnsureQuery(
                getLogShiftQueryOptions(params.shiftId)
            )
        );
    },
    onError: (e) => {
        console.log(e);
        throw redirect({ to: ".." });
    },
});
