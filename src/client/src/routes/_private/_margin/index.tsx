import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/_margin/")({
    component: () => (
        <div className="d-flex flex-column">
            <p>
                <em>Much prettier menu to come</em>
            </p>
            <Link to={"/log"}>Log</Link>
            <Link to={"/pay"}>Pay</Link>
            <Link to={"/settings"}>Settings</Link>
            <Link to={"/logout"}>Logout</Link>
        </div>
    ),
});
