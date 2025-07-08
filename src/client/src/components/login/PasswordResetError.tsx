import { Link } from "@tanstack/react-router";
import ResponseFeedback from "../common/ResponseFeedback";

const PasswordResetError = ({ message }: { message: string }) => (
    <div className="d-flex flex-column gap-3">
        <h3>Reset password</h3>
        <ResponseFeedback
            response={{ success: false, message }}
            error={new Error()}
            isPending={false}
        ></ResponseFeedback>
        <Link to={"/forgot"}>Re-send reset link</Link>
    </div>
);

export default PasswordResetError;
