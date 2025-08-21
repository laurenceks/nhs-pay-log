import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const HoursList = () => {
    const navigate = useNavigate();
    const { employments } = useLoaderData({
        from: "/_private/_nav/_margin/hours/",
    });
    const [employmentId, setEmploymentId] = useState(
        employments[0]?.id.toString() || ""
    );

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
            <Button
                disabled={!employmentId}
                onClick={() =>
                    navigate({
                        to: "/hours/$employmentId",
                        params: { employmentId },
                    })
                }
            >
                See hours
            </Button>
        </div>
    );
};

export default HoursList;
