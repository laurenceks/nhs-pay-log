import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

const TimesheetList = () => {
    const navigate = useNavigate();
    const { timesheetList, employments } = useLoaderData({
        from: "/_private/_nav/_margin/timesheet/",
    });
    const [employmentId, setEmploymentId] = useState(
        employments[0]?.id.toString() || ""
    );
    const filteredTimesheetMonths = timesheetList.filter(
        (x) => x.employment_id.toString() === employmentId
    );
    const [timesheetMonth, setTimesheetMonth] = useState(
        filteredTimesheetMonths[0]?.timesheet_month || ""
    );

    useEffect(() => {
        setTimesheetMonth(filteredTimesheetMonths[0]?.timesheet_month || "");
    }, [employmentId]);

    return (
        <div
            className="my-3 d-flex flex-column gap-3 mx-auto"
            style={{ maxWidth: "15rem" }}
        >
            <Form.Group>
                <Form.Label>Employment</Form.Label>
                <Form.Select
                    disabled={!employments.length}
                    value={employmentId}
                    onChange={(e) => setEmploymentId(e.currentTarget.value)}
                >
                    {employments.map((x) => (
                        <option key={x.id} value={x.id}>
                            {x.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Month</Form.Label>
                <Form.Select
                    disabled={!employmentId || !filteredTimesheetMonths.length}
                    value={timesheetMonth}
                    onChange={(e) =>
                        setTimesheetMonth(e.currentTarget.value.toString())
                    }
                >
                    {filteredTimesheetMonths.map((x) => (
                        <option
                            key={x.timesheet_month}
                            value={x.timesheet_month}
                        >
                            {x.label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Button
                disabled={!employmentId && !timesheetMonth}
                onClick={() =>
                    navigate({
                        to: "/timesheet/$employmentId/$timesheetMonth",
                        params: { employmentId, timesheetMonth },
                    })
                }
            >
                See timesheet
            </Button>
        </div>
    );
};

export default TimesheetList;
