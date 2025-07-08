import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postLoginFetch } from "../../queries/loginQueries";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import ResponseFeedback from "../common/ResponseFeedback";

const Login = () => {
    const navigate = useNavigate();
    const context = useRouteContext({ strict: false });
    const [formState, setFormState] = useState({ email: "", password: "" });
    const { mutate, error, isPending } = useMutation({
        mutationKey: ["login"],
        mutationFn: postLoginFetch,
        onSuccess: (response) => {
            if (response.success) {
                context.auth?.login(response.data);
                const redirect = window.localStorage.getItem("redirect") || "";
                window.localStorage.removeItem("redirect");
                navigate({
                    to: redirect || "/",
                });
            }
        },
    });
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>
        setFormState((prevState) => ({
            ...prevState,
            [e.target.dataset.field as string]: e.target.value,
        }));

    return (
        <div className="position-relative">
            <Form
                className="d-flex flex-column gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    mutate(formState);
                }}
            >
                <h3 className="mb-0">Please log in</h3>
                <Form.Group controlId="editEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder=""
                        value={formState.email}
                        data-field={"email"}
                        onChange={changeHandler}
                        autoComplete={"email"}
                    />
                </Form.Group>
                <Form.Group controlId="editPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        value={formState.password}
                        data-field={"password"}
                        onChange={changeHandler}
                        autoComplete={"current-password"}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    disabled={
                        isPending || !formState.email || !formState.password
                    }
                >
                    Log in
                </Button>
                <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate({ to: "/register" })}
                    disabled={isPending}
                >
                    Sign up
                </Button>
                <Link to={"/forgot"}>Forgot password</Link>
                <ResponseFeedback isPending={isPending} error={error} />
                {error &&
                    "errorCode" in error &&
                    error.errorCode === "userNotVerified" && (
                        <Link to={"/verify/resend"}>Resend verification</Link>
                    )}
            </Form>
        </div>
    );
};

export default Login;
