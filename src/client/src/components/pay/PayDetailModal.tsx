import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../../shared/utils/formatDates";
import CalculationNumberFlow from "../common/CalculationNumberFlow";

const PayDetailModal = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);
    const { employmentId, payMonth } = useParams({
        from: "/_private/_nav/_table/pay/$employmentId/$payMonth",
    });

    const { pay: allPay } = useLoaderData({
        from: "/_private/_nav/_table/pay",
    });

    const foundIndex = allPay.findIndex(
        (x) =>
            x.employment_id === Number(employmentId) && x.pay_month === payMonth
    );

    let formattedPayDate = payMonth;

    if (/\d{2}-\d{2}/.test(payMonth)) {
        const [y, m] = payMonth.split("-");
        formattedPayDate = formatDate(`20${y}-${m}-01`, "mmm yyyy");
    }

    if (foundIndex === -1) {
        toast.error(
            `No pay for that employment ID ${employmentId} in ${formattedPayDate}`,
            { id: `pay-${employmentId}-${payMonth}-notFound` }
        );
        navigate({ to: "/pay" });
        return null;
    }

    const payDetails = allPay[foundIndex];

    return (
        <Modal
            show={show}
            onExited={() => {
                navigate({ to: "/pay" });
            }}
            size="lg"
            fullscreen={"lg-down"}
        >
            <Modal.Header className="bg-dark text-white">
                <Modal.Title>
                    Pay details for {payDetails.employment_name}{" "}
                    {formattedPayDate}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-2">
                    <div className="rounded-3 bg-dark-subtle p-3">
                        <h4>
                            <Badge bg="dark">Hours</Badge>
                        </h4>
                        <Table
                            size={"sm"}
                            responsive
                            className="pay-details-table hours"
                        >
                            <thead>
                                <tr>
                                    <th>TOIL</th>
                                    <th>Flat</th>
                                    <th>Lower rate</th>
                                    <th>Time and half</th>
                                    <th>Higher rate</th>
                                    <th>Double</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.toil}
                                            precision={5}
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.flat}
                                            precision={5}
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.lower_rate}
                                            precision={5}
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.time_and_half}
                                            precision={5}
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.higher_rate}
                                            precision={5}
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.double}
                                            precision={5}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="rounded-3 bg-success-subtle p-3">
                        <h4>
                            <Badge bg="success">Pay</Badge>
                        </h4>
                        <Table
                            size={"sm"}
                            responsive
                            className="pay-details-table pay"
                        >
                            <thead>
                                <tr>
                                    <th>Basic</th>
                                    <th>Shifts</th>
                                    <th>Extras</th>
                                    <th>HCA</th>
                                    <th>Gross</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.basic_pay}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.shift_pay}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.extras_pay}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.hca_pay}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.gross_pay}
                                            currency
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="rounded-3 bg-danger-subtle p-3">
                        <h4>
                            <Badge bg="danger">Deductions</Badge>
                        </h4>
                        <Table
                            size={"sm"}
                            responsive
                            className="pay-details-table pay"
                        >
                            <thead>
                                <tr>
                                    <th>Pension</th>
                                    <th>PAYE</th>
                                    <th>NI</th>
                                    <th>Student loan</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.deduction_pension}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.deduction_paye}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.deduction_ni}
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={
                                                payDetails.deduction_student_loan
                                            }
                                            currency
                                        />
                                    </td>
                                    <td>
                                        <CalculationNumberFlow
                                            value={payDetails.deductions_total}
                                            currency
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <h2 className="m-3">
                        Net pay:{" "}
                        <span className="text-success">
                            <strong>
                                <CalculationNumberFlow
                                    value={payDetails.net_pay}
                                    currency
                                />
                            </strong>
                        </span>
                    </h2>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {foundIndex > 0 && (
                    <Button
                        onClick={() =>
                            navigate({
                                to: "/pay/$employmentId/$payMonth",
                                params: {
                                    employmentId:
                                        allPay[
                                            foundIndex - 1
                                        ].employment_id.toString(),
                                    payMonth: allPay[foundIndex - 1].pay_month,
                                },
                            })
                        }
                        variant="secondary"
                    >
                        Previous
                    </Button>
                )}
                {foundIndex < allPay.length - 1 && (
                    <Button
                        onClick={() =>
                            navigate({
                                to: "/pay/$employmentId/$payMonth",
                                params: {
                                    employmentId:
                                        allPay[
                                            foundIndex + 1
                                        ].employment_id.toString(),
                                    payMonth: allPay[foundIndex + 1].pay_month,
                                },
                            })
                        }
                        variant="secondary"
                    >
                        Next
                    </Button>
                )}
                <Button onClick={() => setShow(false)} variant="success">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PayDetailModal;
