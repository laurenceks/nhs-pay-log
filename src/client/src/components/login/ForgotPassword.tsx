import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { postForgotFetch } from "../../queries/loginQueries";
import ResponseFeedback from "../common/ResponseFeedback";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFeedback from "../common/FormFeedback";
import { z } from "zod";

const ForgotPassword = () => {
    const {
        register,
        formState: { isValid, errors },
        handleSubmit,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
        },
        resolver: zodResolver(
            z.object({
                email: z.email("Enter a valid email address"),
            })
        ),
    });
    const { mutate, error, isPending, data } = useMutation({
        mutationKey: ["forgot"],
        mutationFn: postForgotFetch,
    });

    return (
        <div className="position-relative">
            <Form
                className="d-flex flex-column gap-3"
                onSubmit={handleSubmit((formData) => mutate(formData))}
            >
                <h3 className="mb-0">Forgot password</h3>
                <Form.Group controlId="editEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        {...register("email")}
                        type="email"
                        autoComplete={"email"}
                    />
                </Form.Group>
                {!data && (
                    <Button type="submit" disabled={isPending || !isValid}>
                        Send reset link
                    </Button>
                )}
                <FormFeedback
                    show={Object.keys(errors).length > 0}
                    errors={errors}
                />
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
