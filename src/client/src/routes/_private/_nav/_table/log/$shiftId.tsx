import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import { getLogShiftQueryOptions } from "../../../../../queries/logQueries";
import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import ShiftEdit from "../../../../../components/shiftEdit/ShiftEdit";
import {
    ClientShift,
    Contract,
} from "../../../../../../../../types/commonTypes";
import { formatDate } from "../../../../../../../shared/utils/formatDates";
import { queryClient } from "../../../../../../../shared/queryClient";
import { ApiResponse } from "../../../../../../../../types/responseTypes";
import { updateShiftContract } from "../../../../../../../shared/utils/updateShiftContract";
import {
    financialYear,
    flowersPayMonth,
} from "../../../../../../../shared/calculations/payDates";

export const Route = createFileRoute("/_private/_nav/_table/log/$shiftId")({
    component: memo(ShiftEdit),
    loader: async ({ params, context }): Promise<ClientShift> => {
        if (params.shiftId !== "new") {
            return (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(
                        getLogShiftQueryOptions(parseInt(params.shiftId, 10))
                    )
                )
            ).data;
        } else {
            const today = formatDate(new Date(), "yyyy-mm-dd");
            const contracts =
                (
                    queryClient.getQueryData(["contracts"]) as ApiResponse<
                        Contract[]
                    >
                )?.data || [];
            const [, , filteredContracts] = updateShiftContract(
                null,
                null,
                contracts,
                today
            );
            const onlyContract =
                filteredContracts.length === 1 ? filteredContracts[0] : null;

            return {
                absent_hours: 0,
                actual_end: "",
                actual_hours: 0,
                actual_to: "",
                break_from_higher: onlyContract
                    ? !!onlyContract?.break_from_higher
                    : false,
                break_override: null,
                break_override_string: null,
                contract_id: onlyContract?.id || 0,
                date: today,
                double: 0,
                employment_id: onlyContract?.employment_id || 0,
                employment_name: onlyContract?.employment_name || "",
                extras_ids_string: "",
                flat: 0,
                flowers_pay_month: flowersPayMonth(today),
                from: "",
                half_is_all_ush: onlyContract
                    ? !!onlyContract?.half_is_all_ush
                    : true,
                higher_rate: 0,
                id: 0,
                leave_on_relief_ush_details: null,
                leave_relief_ush_type: "best",
                lower_rate: 0,
                manual_higher_rate: 0,
                manual_lower_rate: 0,
                notes: "",
                overrun_hours: 0,
                overrun_type: "OT",
                pay_date: formatDate(today, "yyyy-mm-dd"),
                pay_financial_year: financialYear(today),
                pay_id_override: null,
                pay_month: formatDate(today, "yy-mm"),
                planned_end: "",
                planned_to: "",
                selectedExtras: [],
                start: "",
                time_and_half: 0,
                toil: 0,
                type: "Normal",
                weekly_hours: onlyContract?.weekly_hours || 37.5,
            };
        }
    },
    gcTime: 0,
});
