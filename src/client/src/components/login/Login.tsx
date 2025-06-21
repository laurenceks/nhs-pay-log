import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../../queries/loginQueries";
import { useNavigate, useRouteContext } from "@tanstack/react-router";

const Login = () => {
    const navigate = useNavigate();
    const context = useRouteContext({ strict: false });
    const [formState, setFormState] = useState({ email: "", password: "" });
    const { mutate, error, isPending } = useMutation({
        mutationKey: ["login"],
        mutationFn: postLogin,
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
                {!!error && !isPending && (
                    <div className="bg-danger text-white px-3 py-2 text-center w-100 rounded d-flex small justify-content-center">
                        {error.message}
                    </div>
                )}
            </Form>
        </div>
    );
};

export default Login;
