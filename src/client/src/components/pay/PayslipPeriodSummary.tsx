import { roundTo } from "round-to";
import { formatDate } from "../../../../shared/utils/formatDates";

const PayslipPeriodSummary = ({
    taxable_pay,
    pensionable_pay,
    gross_pay,
    net_pay,
    pay_date,
    deduction_pension,
    deductions_total,
}: {
    taxable_pay: number;
    pensionable_pay: number;
    gross_pay: number;
    net_pay: number;
    pay_date: string;
    deduction_pension: number;
    deductions_total: number;
}) => {
    console.log(pay_date.slice(2, 4), pay_date.slice(5, 7));
    return (
        <table className="b-l b-r b-b bb">
            <thead>
                <tr className="shade b-b">
                    <th colSpan={2}>This Period Summary</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <table className="label-val b-r">
                            <tbody>
                                <tr>
                                    <td>PENSIONABLE PAY</td>
                                    <td>{roundTo(pensionable_pay, 2)}</td>
                                </tr>
                                <tr>
                                    <td>TAX PERIOD</td>
                                    <td>1</td>
                                </tr>
                                <tr>
                                    <td>FREQUENCY</td>
                                    <td>Monthly</td>
                                </tr>
                                <tr>
                                    <td>PERIOD END DATE</td>
                                    <td>
                                        {formatDate(
                                            new Date(
                                                Number(pay_date.slice(0, 4)),
                                                Number(pay_date.slice(5, 7)),
                                                0
                                            ),
                                            "dd mmm yy"
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>PAY DATE</td>
                                    <td>{formatDate(pay_date, "dd mmm yy")}</td>
                                </tr>
                                <tr>
                                    <td>PAY METHOD</td>
                                    <td>BACS</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <table className="label-val">
                            <tbody>
                                <tr>
                                    <td>TAXABLE PAY</td>
                                    <td>{roundTo(taxable_pay, 2)}</td>
                                </tr>
                                <tr>
                                    <td>NON-TAXABLE PAY</td>
                                    <td>
                                        {roundTo(
                                            gross_pay -
                                                deduction_pension -
                                                taxable_pay,
                                            2
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>TOTAL PAYMENTS</td>
                                    <td>{roundTo(gross_pay, 2)}</td>
                                </tr>
                                <tr className="b-b bb">
                                    <td>TOTAL DEDUCTIONS</td>
                                    <td>{roundTo(deductions_total, 2)}</td>
                                </tr>
                                <tr className="b-l">
                                    <td className="t-xl">NET PAY</td>
                                    <td className="t-xl">
                                        {roundTo(net_pay, 2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default PayslipPeriodSummary;
