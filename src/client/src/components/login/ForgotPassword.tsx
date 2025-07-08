import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postForgotFetch } from "../../queries/loginQueries";
import ResponseFeedback from "../common/ResponseFeedback";

const ForgotPassword = () => {
    const [formState, setFormState] = useState({
        email: "",
    });
    const { mutate, error, isPending, data } = useMutation({
        mutationKey: ["forgot"],
        mutationFn: postForgotFetch,
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
                    mutate(formState);
                }}
            >
                <h3 className="mb-0">Forgot password</h3>
                <Form.Group controlId="editEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder=""
                        value={formState.email}
                        data-field={"email"}
                        autoComplete={"email"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                {!data && (
                    <Button
                        type="submit"
                        disabled={isPending || !formState.email}
                    >
                        Send reset link
                    </Button>
                )}
                <ResponseFeedback
                    response={data}
                    error={error}
                    isPending={isPending}
                ></ResponseFeedback>
            </Form>
        </div>
    );
};

export default ForgotPassword;
