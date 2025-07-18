import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
import SettingsEmployment from "./SettingsEmployment";

const Settings = () => {
    const navigate = useNavigate();
    const { employments } = useLoaderData({
        from: "/_private/_table/settings",
    });
    return (
        <div>
            <div className="pt-3 px-3">
                <h1>User settings</h1>
                <h2>Employments</h2>
            </div>
            {employments.map((x) => (
                <SettingsEmployment key={x.id} employment={x} />
            ))}
            <div className="ms-4 my-3 d-flex gap-3">
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

export default Settings;
