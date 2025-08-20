import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import {
    createFileRoute,
    Outlet,
    useLocation,
    useRouterState,
} from "@tanstack/react-router";
import { ParsedApiPay } from "../../../../../../../../types/commonTypes";
import { getPayQueryOptions } from "../../../../../queries/payQueries";
import { TaxYear } from "@saving-tool/hmrc-income-tax/lib/types";
import {
    calculateEmployeeNationalInsurance,
    calculateIncomeTax,
    calculatePersonalAllowance,
    calculateStudentLoanRepayments,
} from "@saving-tool/hmrc-income-tax";
import Pay from "../../../../../components/pay/Pay";

export const Route = createFileRoute("/_private/_nav/_table/pay")({
    component: () => {
        const location = useLocation();
        const isLoading = useRouterState({
            select: (s) => s.isLoading,
        });
        if (location.pathname.endsWith("payslip") && !isLoading) {
            return <Outlet />;
        } else {
            return <Pay />;
        }
    },
    loader: async ({ context }) => {
        const pay: ParsedApiPay[] =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getPayQueryOptions)
                )
            ).data?.map((x) => {
                const personal_allowance = Number(x.personal_allowance);
                const taxable_pay = Number(x.taxable_pay);
                const pensionable_pay = Number(x.pensionable_pay);
                const pension_perc = Number(x.pension_perc);
                const gross_pay = Number(x.gross_pay);

                const taxYear =
                    `20${x.pay_financial_year.replace("-", "/")}` as TaxYear;
                const taxableAnnualIncome = taxable_pay * 12;
                const personalAllowance = Math.max(
                    Math.min(
                        calculatePersonalAllowance({
                            taxYear,
                            taxableAnnualIncome,
                        }),
                        personal_allowance
                    ),
                    0
                );

                let { total: deduction_paye } = calculateIncomeTax({
                    taxYear,
                    personalAllowance,
                    taxableAnnualIncome,
                });

                deduction_paye = deduction_paye / 12;

                const deduction_ni =
                    calculateEmployeeNationalInsurance({
                        taxYear,
                        taxableAnnualIncome,
                    }) / 12;

                let deduction_student_loan = 0;

                if (x.student_loan) {
                    deduction_student_loan =
                        calculateStudentLoanRepayments({
                            taxYear,
                            taxableAnnualIncome,
                            studentLoanPlanNo:
                                x.student_loan === 6
                                    ? "postgrad"
                                    : x.student_loan,
                        }) / 12;
                }

                const deduction_pension = pensionable_pay * pension_perc;
                const deductions_total =
                    deduction_ni +
                    deduction_paye +
                    deduction_student_loan +
                    deduction_pension;

                return {
                    ...x,
                    extra_hours: Number(x.extra_hours),
                    extra_pay: Number(x.extra_pay),
                    extras_pay: Number(x.extras_pay),
                    rate: Number(x.rate),
                    shift_pay: Number(x.shift_pay),
                    total_ush: Number(x.total_ush),
                    basic_pay: Number(x.basic_pay),
                    hca_pay: Number(x.hca_pay),
                    gross_pay,
                    pensionable_pay,
                    taxable_pay,
                    flowers_hours: Number(x.flowers_hours),
                    flowers_pay: Number(x.flowers_pay),
                    pension_perc,
                    personal_allowance,
                    deduction_ni,
                    deduction_paye,
                    deduction_student_loan,
                    deduction_pension,
                    deductions_total,
                    net_pay: gross_pay - deductions_total,
                    weekly_hours_perc: Number(x.weekly_hours_perc),
                };
            }) || [];

        return { pay };
    },
});
