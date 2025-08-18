import { ParsedApiPay } from "../../../../../types/commonTypes";
import { roundTo } from "round-to";

const PayslipYearToDate = ({
    allPay,
    employmentId,
    payMonth,
    financialYear,
}: {
    allPay: ParsedApiPay[];
    employmentId: number;
    payMonth: string;
    financialYear: string;
}) => {
    const totals = allPay.reduce(
        (previousValue, currentValue) => {
            if (
                currentValue.employment_id === employmentId &&
                currentValue.pay_financial_year === financialYear &&
                currentValue.pay_month <= payMonth
            ) {
                return {
                    gross_pay: previousValue.gross_pay + currentValue.gross_pay,
                    deduction_ni:
                        previousValue.deduction_ni + currentValue.deduction_ni,
                    deduction_paye:
                        previousValue.deduction_paye +
                        currentValue.deduction_paye,
                    taxable_pay:
                        previousValue.taxable_pay + currentValue.taxable_pay,
                    pensionable_pay:
                        previousValue.pensionable_pay +
                        currentValue.pensionable_pay,
                    deduction_pension:
                        previousValue.deduction_pension +
                        currentValue.deduction_pension,
                };
            } else {
                return previousValue;
            }
        },
        {
            gross_pay: 0,
            deduction_ni: 0,
            deduction_paye: 0,
            taxable_pay: 0,
            pensionable_pay: 0,
            deduction_pension: 0,
        }
    );
    return (
        <table className="b-b b-r b-l bb">
            <thead>
                <tr className="shade b-b">
                    <th colSpan={2}>
                        Year To Date Balances (This Employment Only)
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <table className="b-r">
                            <tbody>
                                <tr>
                                    <td>
                                        <table className="label-val b-b">
                                            <tbody>
                                                <tr>
                                                    <td>GROSS PAY</td>
                                                    <td>
                                                        {roundTo(
                                                            totals.gross_pay,
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>NI LETTER</td>
                                                    <td>A</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table className="label-val b-b">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table className="table-payslip-ytd-two-col auto">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        NI PAY
                                                                    </td>
                                                                    <td>
                                                                        {roundTo(
                                                                            totals.gross_pay,
                                                                            2
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        NI CONTS
                                                                    </td>
                                                                    <td>
                                                                        {roundTo(
                                                                            totals.deduction_ni,
                                                                            2
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td>
                                                        <table className="label-val">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        OTHER NI
                                                                        PAY
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        OTHER NI
                                                                        CONTS
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table className="label-val">
                                            <tbody>
                                                <tr>
                                                    <td>PENSIONABLE PAY</td>
                                                    <td>
                                                        {roundTo(
                                                            totals.gross_pay,
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>SD REF NUMBER</td>
                                                    <td>1234567</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table className="label-val">
                            <tbody>
                                <tr>
                                    <td>TAXABLE PAY</td>
                                    <td>{roundTo(totals.taxable_pay, 2)}</td>
                                </tr>
                                <tr>
                                    <td>TAX PAID</td>
                                    <td>{roundTo(totals.deduction_paye, 2)}</td>
                                </tr>
                                <tr>
                                    <td>PREVIOUS TAXABLE PAY</td>
                                    <td>0.00</td>
                                </tr>
                                <tr>
                                    <td>PREVIOUS TAX PAID</td>
                                    <td>0.00</td>
                                </tr>
                                <tr>
                                    <td>PENSION CONTS</td>
                                    <td>
                                        {roundTo(totals.deduction_pension, 2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td>EMPLOYEE NO.</td>
                                    <td>12345678</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default PayslipYearToDate;
