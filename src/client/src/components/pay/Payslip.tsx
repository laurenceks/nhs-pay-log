import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
import { formatDate } from "../../../../shared/utils/formatDates";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import PayslipEarnings from "./PayslipEarnings";
import PayslipDeductions from "./PayslipDeductions";
import PayslipYearToDate from "./PayslipYearToDate";
import PayslipPeriodSummary from "./PayslipPeriodSummary";
import PayslipDetails from "./PayslipDetails";

const Payslip = () => {
    const navigate = useNavigate();
    const { payslip } = useLoaderData({
        from: "/_private/_nav/_table/pay/$employmentId/$payMonth/payslip",
    });
    const { employmentId, payMonth } = useParams({
        from: "/_private/_nav/_table/pay/$employmentId/$payMonth/payslip",
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    console.log(payDetails);

    return (
        <div className="p-3 minh-100">
            <div className="d-flex flex-column gap-3">
                <div>
                    <Button
                        size="sm"
                        onClick={() => navigate({ to: ".." })}
                        variant="light"
                    >
                        Back
                    </Button>
                </div>
                <div className="w-100">
                    <div className="payslip-grid mx-auto">
                        <div>
                            <PayslipDetails
                                {...{ ...payDetails, ...payslip }}
                            />
                        </div>
                        <div className="b-l b-r b-t bb">
                            <PayslipEarnings payslip={payslip} />
                            <PayslipDeductions {...payDetails} />
                        </div>
                        <div className="b-t b-b bb">
                            <PayslipYearToDate
                                allPay={allPay}
                                payMonth={payDetails.pay_month}
                                financialYear={payDetails.pay_financial_year}
                                employmentId={payDetails.employment_id}
                            />
                            <PayslipPeriodSummary {...payDetails} />
                        </div>
                        <div>{/*Empty*/}</div>
                        <div className="b bb">
                            <div className="b-b bb">Messages from Employer</div>
                            <div>Hello, world!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payslip;
