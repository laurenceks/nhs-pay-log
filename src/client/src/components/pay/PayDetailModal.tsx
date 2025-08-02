import { useState } from "react";
import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { Button, Modal } from "react-bootstrap";
import ShiftEditModalCalculation from "../shiftEdit/ShiftEditModalCalculation";
import { toast } from "react-hot-toast";
import { formatDate } from "../../../../shared/utils/formatDates";
import CalculationNumberFlow from "../common/CalculationNumberFlow";

const PayDetailModal = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(true);
    const { employmentId, payMonth } = useParams({
        from: "/_private/_table/pay/$employmentId/$payMonth",
    });

    const { pay: allPay } = useLoaderData({
        from: "/_private/_table/pay",
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
                    <h5>Hours</h5>
                    <div className="d-flex flex-wrap">
                        <ShiftEditModalCalculation
                            label="TOIL"
                            value={payDetails.toil}
                        />
                        <ShiftEditModalCalculation
                            label="Flat"
                            value={payDetails.flat}
                        />
                        <ShiftEditModalCalculation
                            label="Lower rate"
                            value={payDetails.lower_rate}
                        />
                        <ShiftEditModalCalculation
                            label="Higher rate"
                            value={payDetails.higher_rate}
                        />
                        <ShiftEditModalCalculation
                            label="Time and a half"
                            value={payDetails.time_and_half}
                        />
                        <ShiftEditModalCalculation
                            label="Double"
                            value={payDetails.double}
                        />
                    </div>
                    <h5>Pay</h5>
                    <div className="d-flex flex-wrap">
                        <ShiftEditModalCalculation
                            label="Basic"
                            value={payDetails.basic_pay}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="Shifts"
                            value={payDetails.shift_pay}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="Extras"
                            value={payDetails.extras_pay}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="HCA"
                            value={payDetails.hca_pay}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="Gross"
                            value={payDetails.gross_pay}
                            currency
                        />
                    </div>
                    <h5>Deductions</h5>
                    <div className="d-flex flex-wrap">
                        <ShiftEditModalCalculation
                            label={`Pension`}
                            value={payDetails.deduction_pension}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="PAYE"
                            value={payDetails.deduction_paye}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="NI"
                            value={payDetails.deduction_ni}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="Student loan"
                            value={payDetails.deduction_student_loan}
                            currency
                        />
                        <ShiftEditModalCalculation
                            label="Total"
                            value={payDetails.deductions_total}
                            currency
                        />
                    </div>
                    <h2 className="my-3">
                        Net pay:{" "}
                        <span className="text-success">
                            <CalculationNumberFlow
                                value={payDetails.net_pay}
                                currency={true}
                                precision={5}
                            />
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
