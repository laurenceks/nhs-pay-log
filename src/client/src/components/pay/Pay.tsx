import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import { formatDate } from "../../../../shared/utils/formatDates";
import {
    calculateEmployeeNationalInsurance,
    calculateIncomeTax,
    calculatePersonalAllowance,
    calculateStudentLoanRepayments,
} from "@saving-tool/hmrc-income-tax";
import { TaxYear } from "@saving-tool/hmrc-income-tax/lib/types";
import { convertToGbp } from "../../../../shared/utils/conversions";

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
                        const personalAllowance = Math.max(
                            Math.min(
                                calculatePersonalAllowance({
                                    taxYear,
                                    taxableAnnualIncome,
                                }),
                                x.personal_allowance
                            ),
                            0
                        );

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
                                <td>{convertToGbp(x.basic_pay)}</td>
                                <td>{convertToGbp(x.hca_pay)}</td>
                                <td>{convertToGbp(x.extras_pay)}</td>
                                <td>{convertToGbp(x.shift_pay)}</td>
                                <td className="text-success">
                                    {convertToGbp(x.gross_pay)}
                                </td>
                                <td>{convertToGbp(x.pensionable_pay)}</td>
                                <td>{convertToGbp(x.taxable_pay)}</td>
                                <td className="text-danger">
                                    {convertToGbp(ni / 12)}
                                </td>
                                <td className="text-danger">
                                    {convertToGbp(paye / 12)}
                                </td>
                                <td className="text-danger">
                                    {convertToGbp(studentLoan / 12)}
                                </td>
                                <td className="text-danger">
                                    {convertToGbp(
                                        x.pensionable_pay * x.pension_perc
                                    )}
                                </td>
                                <td className="text-success">
                                    {convertToGbp(
                                        x.gross_pay -
                                            paye / 12 -
                                            ni / 12 -
                                            studentLoan / 12 -
                                            x.pensionable_pay * x.pension_perc
                                    )}
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
