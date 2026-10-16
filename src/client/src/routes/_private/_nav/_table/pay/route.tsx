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
import { MonthNumber } from "../../../../../../../shared/calculations/monthlyPaye";

type CumulativePayMap = {
    [key: string | number]: { [key: string]: number };
};

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
        const cumulativeTaxableIncomes: CumulativePayMap = {};
        const cumulativeTaxPaid: CumulativePayMap = {};

        const pay: ParsedApiPay[] =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getPayQueryOptions)
                )
            ).data?.map((x) => {
                const personal_allowance = Number(x.personal_allowance);
                const taxable_pay = Number(x.taxable_pay);
                const ni_able_pay = Number(x.ni_able_pay);
                const pensionable_pay = Number(x.pensionable_pay);
                const pension_perc = Number(x.pension_perc);
                const gross_pay = Number(x.gross_pay);

                if (
                    !cumulativeTaxableIncomes[x.employment_id]?.[
                        x.pay_financial_year
                    ]
                ) {
                    cumulativeTaxableIncomes[x.employment_id] = {
                        [x.pay_financial_year]: 0,
                    };
                    cumulativeTaxPaid[x.employment_id] = {
                        [x.pay_financial_year]: 0,
                    };
                }

                cumulativeTaxableIncomes[x.employment_id][
                    x.pay_financial_year
                ] += taxable_pay;

                const taxYear =
                    x.pay_financial_year > "26-27"
                        ? "2026/27"
                        : (`20${x.pay_financial_year.replace("-", "/")}` as TaxYear);
                if (x.pay_financial_year > "26-27") {
                    console.warn(
                        `Tax year ${x.pay_financial_year} not yet supported, defaulting to most recent`
                    );
                }
                const monthNumber = (((Number(x.pay_date.split("-")[1]) + 8) %
                    12) +
                    1) as MonthNumber;
                const personalAllowance = Math.max(
                    Math.min(
                        x.cumulative
                            ? calculatePersonalAllowance({
                                  taxYear,
                                  taxableAnnualIncome:
                                      cumulativeTaxableIncomes[x.employment_id][
                                          x.pay_financial_year
                                      ] *
                                      (12 / monthNumber),
                              })
                            : calculatePersonalAllowance({
                                  taxYear,
                                  taxableAnnualIncome: taxable_pay * 12,
                              }),
                        personal_allowance
                    ),
                    0
                );

                let { total: deduction_paye } = x.cumulative
                    ? calculateIncomeTax({
                          taxYear,
                          country: "England/NI/Wales",
                          cumulativePaye: {
                              cumulativeGrossIncome:
                                  cumulativeTaxableIncomes[x.employment_id][
                                      x.pay_financial_year
                                  ],
                              cumulativeTaxPaid:
                                  cumulativeTaxPaid[x.employment_id][
                                      x.pay_financial_year
                                  ],
                              monthNumber:
                                  ((Number(x.pay_date.split("-")[1]) + 8) %
                                      12) +
                                  1,
                          },
                          personalAllowance,
                      })
                    : calculateIncomeTax({
                          taxYear,
                          taxableAnnualIncome: taxable_pay * 12,
                          country: "England/NI/Wales",
                          personalAllowance,
                      });

                if (!x.cumulative) {
                    deduction_paye = deduction_paye / 12;
                }

                cumulativeTaxPaid[x.employment_id][x.pay_financial_year] +=
                    deduction_paye;

                const deduction_ni =
                    calculateEmployeeNationalInsurance({
                        taxYear,
                        taxableAnnualIncome: ni_able_pay * 12,
                    }) / 12;

                let deduction_student_loan = 0;

                if (x.student_loan) {
                    deduction_student_loan =
                        calculateStudentLoanRepayments({
                            taxYear,
                            taxableAnnualIncome: taxable_pay * 12,
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
                    ni_able_pay,
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
