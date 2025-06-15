import { Outlet } from "@tanstack/react-router";

const LoginWrapper = () => {
    return (
        <div className="w-100 h-100 d-flex justify-content-center">
            <div>
                <div className="d-flex align-items-center justify-content-center">
                    <img
                        alt="NHS Pay Log logo"
                        src="/logo.svg"
                        className="mt-4 mb-5 w-100"
                        style={{ maxWidth: "10rem" }}
                    />
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default LoginWrapper;
