import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postVerifyFetch } from "../../queries/loginQueries";
import ResponseFeedback from "../common/ResponseFeedback";

const ResendVerification = () => {
    const [formState, setFormState] = useState({
        email: "",
    });
    const { mutate, error, isPending, data } = useMutation({
        mutationKey: ["verify"],
        mutationFn: postVerifyFetch,
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
                <h3 className="mb-0">Resend verification</h3>
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
                <Button type="submit" disabled={isPending || !formState.email}>
                    Resend
                </Button>
                <ResponseFeedback
                    response={data}
                    error={error}
                    isPending={isPending}
                ></ResponseFeedback>
            </Form>
        </div>
    );
};

export default ResendVerification;
