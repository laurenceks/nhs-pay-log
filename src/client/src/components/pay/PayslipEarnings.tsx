import { ParsedApiPayslip } from "../../../../../types/commonTypes";

const PayslipEarnings = ({ payslip }: { payslip: ParsedApiPayslip[] }) => {
    return (
        <table className="b bb list">
            <thead>
                <tr>
                    <td
                        colSpan={5}
                        className="t-sm fw-bold text-uppercase fw-bold"
                    >
                        PAY AND ALLOWANCES (- = MINUS AMOUNT)
                    </td>
                </tr>
                <tr className="table-payslip-earnings-deductions-title-row">
                    <th>Description</th>
                    <th>Wkd/earned</th>
                    <th>Paid/due</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {payslip.map((x) => (
                    <tr key={x.label}>
                        <td>{x.label}</td>
                        <td>{x.worked}</td>
                        <td>{x.due}</td>
                        <td>{x.rate}</td>
                        <td>{x.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PayslipEarnings;
