import { useLoaderData } from "@tanstack/react-router";
import { Table } from "react-bootstrap";
import { formatDate } from "../../../../shared/utils/formatDates";
import CalculationNumberFlow from "../common/CalculationNumberFlow";

const Pay = () => {
    const { pay } = useLoaderData({ from: "/_private/pay" });
    return (
        <Table striped={true} hover={true}>
            <thead>
                <tr className="sticky-top">
                    <th>Pay Date</th>
                    <th>Basic pay</th>
                    <th>Extra pay</th>
                    <th>Gross pay</th>
                </tr>
            </thead>
            <tbody>
                {pay.map((x) => {
                    return (
                        <tr key={x.id} style={{ cursor: "pointer" }}>
                            <td>{formatDate(x.pay_date, "pay")}</td>
                            <td>
                                <CalculationNumberFlow
                                    value={x.basic_pay}
                                    currency
                                />
                            </td>
                            <td>
                                <CalculationNumberFlow
                                    value={x.extra_pay}
                                    currency
                                />
                            </td>
                            <td>
                                <CalculationNumberFlow
                                    value={x.gross_pay}
                                    currency
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default Pay;
