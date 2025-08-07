import { Navbar } from "react-bootstrap";
import { Link } from "@tanstack/react-router";

const Nav = () => {
    return (
        <Navbar
            bg="secondary"
            className="shadow gap-2 px-3 mb-1"
            sticky="top"
            style={{ zIndex: 1021 }}
        >
            <Link
                to={"/"}
                className="btn btn-sm"
                activeProps={{ className: "btn-primary" }}
                inactiveProps={{ className: "btn-light" }}
            >
                Home
            </Link>
            <Link
                to={"/log"}
                className="btn btn-sm"
                activeProps={{ className: "btn-primary" }}
                inactiveProps={{ className: "btn-light" }}
            >
                Log
            </Link>
            <Link
                to={"/pay"}
                className="btn btn-sm"
                activeProps={{ className: "btn-primary" }}
                inactiveProps={{ className: "btn-light" }}
            >
                Pay
            </Link>
            <Link
                to={"/settings"}
                className="btn btn-sm"
                activeProps={{ className: "btn-primary" }}
                inactiveProps={{ className: "btn-light" }}
            >
                Settings
            </Link>
            <Link to={"/logout"} className="btn btn-sm btn-light">
                Logout
            </Link>
        </Navbar>
    );
};
export default Nav;
