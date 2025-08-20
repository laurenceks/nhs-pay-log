import { createFileRoute } from "@tanstack/react-router";
import { ParsedApiPayslip } from "../../../../../../../../../../types/commonTypes";
import { stripQueryOptionsForEnsureQuery } from "../../../../../../../queries/queryUtils";
import { getPayslipQueryOptions } from "../../../../../../../queries/payQueries";
import Payslip from "../../../../../../../components/pay/Payslip";
import { convertToPayslipFigure } from "../../../../../../../../../shared/utils/conversions";

export const Route = createFileRoute(
    "/_private/_nav/_table/pay/$employmentId/$payMonth/payslip"
)({
    component: Payslip,
    loader: async ({ context, params }) => {
        const payslip: ParsedApiPayslip[] =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(
                        getPayslipQueryOptions(
                            Number(params.employmentId),
                            params.payMonth
                        )
                    )
                )
            ).data?.map((x) => {
                return {
                    ...x,
                    worked: convertToPayslipFigure(x.worked),
                    due: convertToPayslipFigure(x.due),
                    rate: convertToPayslipFigure(x.rate, 4),
                    amount: convertToPayslipFigure(x.amount),
                };
            }) || [];

        return { payslip };
    },
});
