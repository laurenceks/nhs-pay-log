import { roundTo } from "round-to";

const PayslipDeductions = ({
    deduction_ni,
    deduction_paye,
    deduction_student_loan,
    deduction_pension,
    pension_perc,
}: {
    deduction_ni: number;
    deduction_paye: number;
    deduction_student_loan: number;
    deduction_pension: number;
    pension_perc: number;
}) => {
    return (
        <table className="b-l list">
            <thead>
                <tr>
                    <td
                        colSpan={3}
                        className="t-sm fw-bold text-uppercase fw-bold"
                    >
                        DEDUCTIONS (R INDICATES REFUND)
                    </td>
                </tr>
                <tr className="table-payslip-earnings-deductions-title-row">
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Balance C/F</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>PAYE</td>
                    <td>{roundTo(deduction_paye, 2)}</td>
                    <td></td>
                </tr>
                <tr>
                    <td>NI A</td>
                    <td>{roundTo(deduction_ni, 2)}</td>
                    <td></td>
                </tr>
                <tr>
                    <td>NHS Pension {roundTo(pension_perc * 100, 1)}%</td>
                    <td>{roundTo(deduction_pension, 2)}</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Student Loan</td>
                    <td>{roundTo(deduction_student_loan, 2)}</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
};

export default PayslipDeductions;
