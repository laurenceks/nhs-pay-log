import { Navbar } from "react-bootstrap";
import { Link } from "@tanstack/react-router";

const Nav = () => {
    return (
        <Navbar
            bg="secondary"
            className="shadow gap-2 px-3 mb-1 align-items-center"
            sticky="top"
            style={{ zIndex: 1021, overflowX: "auto" }}
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
                to={"/timesheet"}
                className="btn btn-sm"
                activeProps={{ className: "btn-primary" }}
                inactiveProps={{ className: "btn-light" }}
            >
                Timesheets
            </Link>
            <Link
                to={"/hours"}
                className="btn btn-sm"
                activeProps={{ className: "btn-primary" }}
                inactiveProps={{ className: "btn-light" }}
            >
                Hours
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
            <img
                src="logoWide.svg"
                className="ms-auto d-none d-md-flex align-items-center justify-content-center"
                style={{ maxHeight: "2rem", justifySelf: "end" }}
            />
            <img
                src="logo.svg"
                className="ms-auto d-flex d-md-none align-items-center justify-content-center"
                style={{ maxHeight: "3rem", justifySelf: "end" }}
            />
        </Navbar>
    );
};
export default Nav;
