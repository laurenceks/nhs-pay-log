import LogTable from "./LogTable.tsx";
import { Button } from "react-bootstrap";
import { Outlet, useLoaderData, useNavigate } from "@tanstack/react-router";

const Log = ({ disabled }: { disabled: boolean }) => {
    const navigate = useNavigate();
    const log = useLoaderData({ from: "/_private/log" });
    return (
        <div className="position-relative">
            <LogTable log={log} />
            <Outlet />
            <div className="position-fixed bottom-0 start-0 ms-4 mb-3 d-flex gap-3">
                <Button
                    variant="secondary"
                    disabled={disabled}
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    Home
                </Button>
                <Button
                    variant="success"
                    disabled={disabled}
                    onClick={() =>
                        navigate({
                            to: "/log/$shiftId",
                            params: { shiftId: "new" },
                        })
                    }
                >
                    Add
                </Button>
            </div>
        </div>
    );
};

export default Log;
