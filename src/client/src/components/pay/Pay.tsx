import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import { formatDate } from "../../../../shared/utils/formatDates";
import CalculationNumberFlow from "../common/CalculationNumberFlow";
import {
    calculateEmployeeNationalInsurance,
    calculateIncomeTax,
    calculatePersonalAllowance,
    calculateStudentLoanRepayments,
} from "@saving-tool/hmrc-income-tax";
import { TaxYear } from "@saving-tool/hmrc-income-tax/lib/types";

const Pay = () => {
    const navigate = useNavigate();
    const { pay } = useLoaderData({ from: "/_private/_table/pay" });
    return (
        <div className="position-relative">
            <Table striped={true} hover={true} responsive={true}>
                <thead>
                    <tr className="sticky-top">
                        <th scope="col">Pay Date</th>
                        <th scope="col">Employment</th>
                        <th scope="col">Basic</th>
                        <th scope="col">HCA</th>
                        <th scope="col">Extras</th>
                        <th scope="col">Shifts</th>
                        <th scope="col">Gross</th>
                        <th scope="col">Pensionable</th>
                        <th scope="col">Taxable</th>
                        <th scope="col">NI</th>
                        <th scope="col">PAYE</th>
                        <th scope="col">Loan</th>
                        <th scope="col">Pension</th>
                        <th scope="col" className="fw-bolder">
                            Net
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pay.map((x) => {
                        const taxYear =
                            `20${x.pay_financial_year.replace("-", "/")}` as TaxYear;
                        const taxableAnnualIncome = x.taxable_pay * 12;
                        const personalAllowance = calculatePersonalAllowance({
                            taxYear,
                            taxableAnnualIncome,
                        });

                        const { total: paye } = calculateIncomeTax({
                            taxYear,
                            personalAllowance,
                            taxableAnnualIncome,
                        });

                        const ni = calculateEmployeeNationalInsurance({
                            taxYear,
                            taxableAnnualIncome,
                        });

                        let studentLoan = 0;

                        if (x.student_loan) {
                            studentLoan = calculateStudentLoanRepayments({
                                taxYear,
                                taxableAnnualIncome,
                                studentLoanPlanNo:
                                    x.student_loan === 6
                                        ? "postgrad"
                                        : x.student_loan,
                            });
                        }

                        return (
                            <tr key={x.pay_date + x.employment_name}>
                                <th scope="row">
                                    {formatDate(x.pay_date, "pay")}
                                </th>
                                <th>{x.employment_name}</th>
                                <td>
                                    <CalculationNumberFlow
                                        value={x.basic_pay}
                                        currency
                                    />
                                </td>
                                <td>
                                    <CalculationNumberFlow
                                        value={x.hca_pay}
                                        currency
                                    />
                                </td>
                                <td>
                                    <CalculationNumberFlow
                                        value={x.extras_pay}
                                        currency
                                    />
                                </td>
                                <td>
                                    <CalculationNumberFlow
                                        value={x.shift_pay}
                                        currency
                                    />
                                </td>
                                <td className="text-success">
                                    <CalculationNumberFlow
                                        value={x.gross_pay}
                                        currency
                                    />
                                </td>
                                <td>
                                    <CalculationNumberFlow
                                        value={x.pensionable_pay}
                                        currency
                                    />
                                </td>
                                <td>
                                    <CalculationNumberFlow
                                        value={x.taxable_pay}
                                        currency
                                    />
                                </td>
                                <td className="text-danger">
                                    <CalculationNumberFlow
                                        value={ni / 12}
                                        currency
                                    />
                                </td>
                                <td className="text-danger">
                                    <CalculationNumberFlow
                                        value={paye / 12}
                                        currency
                                    />
                                </td>
                                <td className="text-danger">
                                    <CalculationNumberFlow
                                        value={studentLoan / 12}
                                        currency
                                    />
                                </td>
                                <td className="text-danger">
                                    <CalculationNumberFlow
                                        value={
                                            x.pensionable_pay * x.pension_perc
                                        }
                                        currency
                                    />
                                </td>
                                <td className="text-success">
                                    <CalculationNumberFlow
                                        value={
                                            x.gross_pay -
                                            paye / 12 -
                                            ni / 12 -
                                            studentLoan / 12 -
                                            x.pensionable_pay * x.pension_perc
                                        }
                                        currency
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            <div className="position-fixed bottom-0 start-0 ms-4 mb-3 d-flex gap-3">
                <Button
                    variant="secondary"
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    Home
                </Button>
            </div>
        </div>
    );
};

export default Pay;
