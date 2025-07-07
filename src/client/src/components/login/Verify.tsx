import { Link } from "@tanstack/react-router";

const Verify = ({
    success,
    message,
}: {
    success: boolean;
    message: string;
}) => (
    <>
        <div
            className={`bg-${success ? "success" : "danger"} text-white rounded p-3 mb-3`}
        >
            {message}
        </div>
        <Link to={success ? "/login" : "/register"}>
            {success ? "Login" : "Re-send verification link"}
        </Link>
    </>
);

export default Verify;
