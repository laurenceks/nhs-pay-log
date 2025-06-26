import { createFileRoute } from "@tanstack/react-router";
import ShiftEditModal from "../../../components/shiftEdit/ShiftEditModal";
import { formatDate } from "../../../../../shared/utils/formatDates";
import { Contract, LogShift } from "../../../../../../types/commonTypes";
import { getLogShiftQueryOptions } from "../../../queries/logQueries";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { financialYear } from "../../../../../shared/calculations/payDates";
import { getContractsQueryOptions } from "../../../queries/contractQueries";
import { updateShiftContract } from "../../../../../shared/utils/updateShiftContract";

export const Route = createFileRoute("/_private/log/$shiftId")({
    component: ShiftEditModal,
    loader: async ({
        params,
        context,
    }): Promise<{ shift: LogShift; contracts: Contract[] }> => {
        const contracts = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getContractsQueryOptions)
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
            return { shift, contracts };
        } else {
            const today = formatDate(new Date(), "yyyy-mm-dd");
            const [, , filteredContracts] = updateShiftContract(
                null,
                null,
                contracts,
                today
            );
            const onlyContract =
                filteredContracts.length === 1 ? filteredContracts[0] : null;
            console.log(onlyContract);
            const shift: LogShift = {
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
                weekly_hours: onlyContract?.weekly_hours || 37.5,
            };
            return { shift, contracts };
        }
    },
    gcTime: 0,
});
