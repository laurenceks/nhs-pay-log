import LogTable from "./LogTable";
import { Button } from "react-bootstrap";
import { Outlet, useLoaderData, useNavigate } from "@tanstack/react-router";
import { memo } from "react";

// eslint-disable-next-line react/display-name
const Log = memo(({ disabled }: { disabled: boolean }) => {
    const navigate = useNavigate();
    const { displayLog } = useLoaderData({ from: "/_private/_table/log" });
    return (
        <div className="position-relative">
            <LogTable log={displayLog} />
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
});

export default Log;
