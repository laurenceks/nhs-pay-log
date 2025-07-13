import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { postLoginFetch } from "../../queries/loginQueries";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import ResponseFeedback from "../common/ResponseFeedback";
import { useForm } from "react-hook-form";
import FormFeedback from "../common/FormFeedback";

const Login = () => {
    const navigate = useNavigate();
    const context = useRouteContext({ strict: false });
    const {
        register,
        formState: { isValid, errors },
        handleSubmit,
    } = useForm({
        mode: "onChange",
        defaultValues: { email: "", password: "" },
    });
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

    return (
        <div className="position-relative">
            <Form
                className="d-flex flex-column gap-3"
                onSubmit={handleSubmit((data) => {
                    mutate(data);
                })}
                noValidate={true}
            >
                <h3 className="mb-0">Please log in</h3>
                <Form.Group controlId="editEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        {...register("email", { required: "Email required" })}
                        type="email"
                        placeholder=""
                        autoComplete={"email"}
                        isInvalid={!!errors.email}
                    />
                </Form.Group>
                <Form.Group controlId="editPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        {...register("password", {
                            required: "Password required",
                        })}
                        type="password"
                        placeholder=""
                        autoComplete={"current-password"}
                        isInvalid={!!errors.password}
                    />
                </Form.Group>
                <Button type="submit" disabled={isPending || !isValid}>
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
                <FormFeedback
                    show={Object.keys(errors).length > 0}
                    errors={errors}
                />
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
