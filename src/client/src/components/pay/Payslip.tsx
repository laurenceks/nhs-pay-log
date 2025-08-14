import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button } from "react-bootstrap";

const Payslip = () => {
    const navigate = useNavigate();
    const { payslip } = useLoaderData({
        from: "/_private/_nav/_table/pay/$employmentId/$payMonth/payslip",
    });

    return (
        <div
            className="position-absolute top-0 start-0 w-100 minh-100 bg-white p-3 d-flex flex-column gap-3"
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
            <table>
                <thead>
                    <tr>
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
        </div>
    );
};

export default Payslip;
