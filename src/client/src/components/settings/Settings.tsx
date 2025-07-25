import { useNavigate } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
import SettingsEmployments from "./employment/SettingsEmployments";

const Settings = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="pt-3 px-3">
                <h1>User settings</h1>
            </div>
            <SettingsEmployments />
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
