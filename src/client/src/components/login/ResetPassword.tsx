import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { patchForgotFetch } from "../../queries/loginQueries";
import ResponseFeedback from "../common/ResponseFeedback";
import { Link, useSearch } from "@tanstack/react-router";
import Loading from "../common/Loading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotSchema } from "../../../../shared/validationSchemas/commonValidationSchemas";
import FormFeedback from "../common/FormFeedback";

const ResetPassword = () => {
    const {
        register,
        formState: { isValid, errors },
        handleSubmit,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            newPassword1: "",
            newPassword2: "",
        },
        resolver: zodResolver(forgotSchema),
    });

    const { selector, token } = useSearch({
        from: "/_public/_login/forgot/reset",
    });

    const { mutate, error, isPending, submittedAt, data } = useMutation({
        mutationKey: ["resetPassword"],
        mutationFn: patchForgotFetch,
    });

    return (
        <div className="position-relative">
            <Form
                className="d-flex flex-column gap-3"
                onSubmit={handleSubmit((formState) => {
                    mutate({ formState, selector, token });
                })}
            >
                <h3 className="mb-0">Reset password</h3>
                {!submittedAt && (
                    <>
                        <Form.Group controlId="editEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control {...register("email")} type="email" />
                        </Form.Group>
                        <Form.Group controlId="editPassword"></Form.Group>
                        <Form.Group controlId="editNewPassword1">
                            <Form.Label>New password</Form.Label>
                            <Form.Control
                                {...register("newPassword1")}
                                type="password"
                                autoComplete={"new-password"}
                            />
                        </Form.Group>
                        <Form.Group controlId="editNewPassword2">
                            <Form.Label>Confirm new password</Form.Label>
                            <Form.Control
                                {...register("newPassword2")}
                                type="password"
                                placeholder=""
                                autoComplete={"new-password"}
                            />
                        </Form.Group>
                        <Button type="submit" disabled={isPending || !isValid}>
                            Reset password
                        </Button>
                    </>
                )}
                <FormFeedback
                    show={Object.keys(errors).length > 0}
                    errors={errors}
                />
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
