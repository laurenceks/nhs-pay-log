import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button, Table } from "react-bootstrap";
import { formatDate } from "../../../../shared/utils/formatDates";
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
                    {pay.map((x) => (
                        <tr key={x.pay_date + x.employment_name}>
                            <th scope="row">{formatDate(x.pay_date, "pay")}</th>
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
                                {convertToGbp(x.deduction_ni)}
                            </td>
                            <td className="text-danger">
                                {convertToGbp(x.deduction_paye)}
                            </td>
                            <td className="text-danger">
                                {convertToGbp(x.deduction_student_loan)}
                            </td>
                            <td className="text-danger">
                                {convertToGbp(x.deduction_pension)}
                            </td>
                            <td className="text-success">
                                {convertToGbp(x.net_pay)}
                            </td>
                        </tr>
                    ))}
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
