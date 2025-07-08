import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { patchForgotFetch } from "../../queries/loginQueries";
import ResponseFeedback from "../common/ResponseFeedback";
import { Link, useSearch } from "@tanstack/react-router";
import Loading from "../common/Loading";

const ResetPassword = () => {
    const [formState, setFormState] = useState({
        email: "",
        password: "",
        newPassword1: "",
        newPassword2: "",
    });

    const { selector, token } = useSearch({
        from: "/_public/_login/forgot/reset",
    });

    const { mutate, error, isPending, submittedAt, data } = useMutation({
        mutationKey: ["resetPassword"],
        mutationFn: patchForgotFetch,
    });
    const changeHandler = (
        e: ChangeEvent<HTMLInputElement> & ChangeEvent<HTMLSelectElement>
    ) =>
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
                    mutate({ formState, selector, token });
                }}
            >
                <h3 className="mb-0">Reset password</h3>
                {!submittedAt && (
                    <>
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
                            <Form.Label>Current password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder=""
                                value={formState.password}
                                data-field={"password"}
                                onChange={changeHandler}
                                autoComplete={"current-password"}
                            />
                        </Form.Group>
                        <Form.Group controlId="editNewPassword1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder=""
                                value={formState.newPassword1}
                                data-field={"newPassword1"}
                                onChange={changeHandler}
                                autoComplete={"new-password"}
                            />
                        </Form.Group>
                        <Form.Group controlId="editNewPassword2">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder=""
                                value={formState.newPassword2}
                                data-field={"newPassword2"}
                                onChange={changeHandler}
                                autoComplete={"new-password"}
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                !formState.email ||
                                !formState.password ||
                                !formState.newPassword1 ||
                                !formState.newPassword2 ||
                                formState.newPassword1 !==
                                    formState.newPassword2
                            }
                        >
                            Reset password
                        </Button>
                    </>
                )}
                {!!(submittedAt && isPending) && <Loading />}
                <ResponseFeedback
                    response={data}
                    error={error}
                    isPending={isPending}
                ></ResponseFeedback>
                {!!error && <Link to={"/forgot"}>Resend reset link</Link>}
                {data?.success && <Link to={"/login"}>Login</Link>}
            </Form>
        </div>
    );
};

export default ResetPassword;
