import { createFileRoute } from "@tanstack/react-router";
import { ParsedApiPayslip } from "../../../../../../../../../../types/commonTypes";
import { stripQueryOptionsForEnsureQuery } from "../../../../../../../queries/queryUtils";
import { getPayslipQueryOptions } from "../../../../../../../queries/payQueries";
import { roundTo } from "round-to";
import Payslip from "../../../../../../../components/pay/Payslip";

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
                    worked: roundTo(Number(x.worked), 2) || "",
                    due: roundTo(Number(x.due), 2) || "",
                    rate: roundTo(Number(x.rate), 4) || "",
                    amount: roundTo(Number(x.amount), 2) || "",
                };
            }) || [];

        return { payslip };
    },
});
