import { useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
import PayslipEarnings from "./PayslipEarnings";
import { formatDate } from "../../../../shared/utils/formatDates";
import { toast } from "react-hot-toast";
import PayslipDeductions from "./PayslipDeductions";
import PayslipYearToDate from "./PayslipYearToDate";
import { useEffect } from "react";

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

    return (
        <div
            className="w-100 minh-100 bg-white p-3 d-flex flex-column gap-3"
            style={{ zIndex: 1021 }}
        >
            <div>
                <Button
                    size="sm"
                    onClick={() => navigate({ to: ".." })}
                    variant="light"
                >
                    Back
                </Button>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <table className="table-payslip">
                    <tbody>
                        <tr>
                            <td className="table-payslip-border-bold p-0">
                                <PayslipEarnings payslip={payslip} />
                            </td>
                            <td className="table-payslip-border-bold p-0">
                                <PayslipDeductions {...payDetails} />
                            </td>
                        </tr>
                        <tr>
                            <td className="p-0">
                                <PayslipYearToDate
                                    allPay={allPay}
                                    payMonth={payDetails.pay_month}
                                    financialYear={
                                        payDetails.pay_financial_year
                                    }
                                    employmentId={payDetails.employment_id}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payslip;
