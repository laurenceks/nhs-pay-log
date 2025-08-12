import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button } from "react-bootstrap";

const Timesheets = () => {
    const navigate = useNavigate();
    const { timesheets } = useLoaderData({
        from: "/_private/_nav/_table/timesheet/",
    });

    return (
        <div className="position-relative d-flex flex-wrap gap-3">
            {timesheets.map((x) => (
                <Button
                    key={x.label}
                    onClick={() =>
                        navigate({
                            to: "/timesheet/$employmentId/$payMonth",
                            params: {
                                employmentId: x.employment_id.toString(),
                                payMonth: x.timesheet_month,
                            },
                        })
                    }
                >
                    {x.label}
                </Button>
            ))}
        </div>
    );
};

export default Timesheets;
