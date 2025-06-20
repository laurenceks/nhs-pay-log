import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/")({
    component: () => (
        <div className="d-flex flex-column">
            <Link to={"/log"}>Log</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/logout"}>Logout</Link>
            <Link to={"/register"}>Register</Link>
        </div>
    ),
});
