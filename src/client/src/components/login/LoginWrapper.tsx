import { Outlet } from "@tanstack/react-router";

const LoginWrapper = () => {
    return (
        <div className="w-100 d-flex justify-content-center minh-100">
            <div style={{ maxWidth: "15rem" }}>
                <div className="d-flex align-items-center justify-content-center">
                    <img
                        alt="NHS Pay Log logo"
                        src="/logo.svg"
                        className="mt-4 mb-5 w-100"
                    />
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default LoginWrapper;
