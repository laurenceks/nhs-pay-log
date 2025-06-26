import { createFileRoute } from "@tanstack/react-router";
import ShiftEditModal from "../../../components/shiftEdit/ShiftEditModal";
import { formatDate } from "../../../../../shared/utils/formatDates";
import { Employment, LogShift } from "../../../../../../types/commonTypes";
import { filterOptionsByDate } from "../../../../../shared/utils/lookup";
import { getLogShiftQueryOptions } from "../../../queries/logQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { financialYear } from "../../../../../shared/calculations/payDates";
import { getEmploymentsQueryOptions } from "../../../queries/employmentQueries";

export const Route = createFileRoute("/_private/log/$shiftId")({
    component: ShiftEditModal,
    loader: async ({
        params,
        context,
    }): Promise<{ shift: LogShift; employments: Employment[] }> => {
        const employments = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getEmploymentsQueryOptions)
            )
        ).data.map((x) => ({ ...x, weekly_hours: Number(x.weekly_hours) }));

        if (params.shiftId !== "new") {
            const shift = (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(
                        getLogShiftQueryOptions(parseInt(params.shiftId, 10))
                    )
                )
            ).data;
            return { shift, employments };
        } else {
            const today = formatDate(new Date(), "yyyy-mm-dd");
            const employmentSelectOptions = filterOptionsByDate<Employment>(
                employments,
                today
            );
            const shift: LogShift = {
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
                        : 0,
                employment_name:
                    employmentSelectOptions.length === 1
                        ? employmentSelectOptions[0].name
                        : "",
                extras: [],
                flat: 0,
                from: "",
                higher_rate: 0,
                id: 0,
                lower_rate: 0,
                overrun_type: "OT",
                planned_end: "",
                planned_to: "",
                start: "",
                time_and_half: 0,
                toil: 0,
                type: "Normal",
                pay_id_override: null,
            };
            return { shift, employments };
        }
    },
    gcTime: 0,
});
