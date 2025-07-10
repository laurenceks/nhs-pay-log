import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import { formatDate } from "../../../../shared/utils/formatDates";
import CalculationNumberFlow from "../common/CalculationNumberFlow";

const Pay = () => {
    const navigate = useNavigate();
    const { pay } = useLoaderData({ from: "/_private/_table/pay" });
    return (
        <div className="position-relative">
            <Table striped={true} hover={true}>
                <thead>
                    <tr className="sticky-top">
                        <th>Pay Date</th>
                        <th>Basic</th>
                        <th>HCA</th>
                        <th>Extras</th>
                        <th>Shifts</th>
                        <th>Gross</th>
                        <th>Pensionable</th>
                        <th>Taxable</th>
                    </tr>
                </thead>
                <tbody>
                    {pay.map((x) => {
                        return (
                            <tr
                                key={x.pay_date + x.employment_name}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{formatDate(x.pay_date, "pay")}</td>
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
                                <td>
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
