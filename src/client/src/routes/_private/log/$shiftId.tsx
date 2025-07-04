import { createFileRoute } from "@tanstack/react-router";
import ShiftEditModal from "../../../components/shiftEdit/ShiftEditModal";
import { formatDate } from "../../../../../shared/utils/formatDates";
import { ClientShift, Contract } from "../../../../../../types/commonTypes";
import { getLogShiftQueryOptions } from "../../../queries/logQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { financialYear } from "../../../../../shared/calculations/payDates";
import { updateShiftContract } from "../../../../../shared/utils/updateShiftContract";
import { queryClient } from "../../../App";
import { ApiResponse } from "../../../../../../types/responseTypes";

export const Route = createFileRoute("/_private/log/$shiftId")({
    component: ShiftEditModal,
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
                actual_end: "",
                actual_to: "",
                date: today,
                pay_date: formatDate(today, "yyyy-mm-dd"),
                pay_month: formatDate(today, "yy-mm"),
                pay_financial_year: financialYear(today),
                double: 0,
                employment_id: onlyContract?.employment_id || 0,
                employment_name: onlyContract?.employment_name || "",
                contract_id: onlyContract?.id || 0,
                contract_name: onlyContract?.name || "",
                extras_ids_string: "",
                selectedExtras: [],
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
                weekly_hours: onlyContract?.weekly_hours || 37.5,
            };
        }
    },
    gcTime: 0,
});
