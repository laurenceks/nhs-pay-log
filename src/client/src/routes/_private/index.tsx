import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_private/")({
    component: () => (
        <div className="d-flex flex-column p-3">
            <Link to={"/log"}>Log</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/logout"}>Logout</Link>
            <Link to={"/register"}>Register</Link>
        </div>
    ),
});
