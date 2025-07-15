import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { postRegisterFetch } from "../../queries/loginQueries";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { formatDate } from "../../../../shared/utils/formatDates";
import ResponseFeedback from "../common/ResponseFeedback";
import { useForm } from "react-hook-form";
import FormFeedback from "../common/FormFeedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidationSchema } from "../../../../shared/validationSchemas/registerValidationSchema";

const Register = () => {
    const navigate = useNavigate();
    const payBands = useLoaderData({ from: "/_public/_login/register" });
    const {
        register,
        getValues,
        formState: { isValid, errors },
        handleSubmit,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            email: "",
            password1: "",
            password2: "",
            pay_group_id: "",
            employment_from: "",
            employment_name: "My job",
            contract_name: "My contract",
            weekly_hours: 37.5,
        },
        resolver: zodResolver(registerValidationSchema),
    });

    const { mutate, data, error, isPending } = useMutation({
        mutationKey: ["register"],
        mutationFn: postRegisterFetch,
        onSuccess: async (response) => {
            if (response.success) {
                await navigate({
                    to: "/",
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
            >
                <h3 className="mb-0">Register</h3>
                <Form.Group controlId="editEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        {...register("email")}
                        type="email"
                        autoComplete={"email"}
                    />
                </Form.Group>
                <Form.Group controlId="editPassword1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        {...register("password1")}
                        type="password"
                        autoComplete={"new-password"}
                    />
                </Form.Group>
                <Form.Group controlId="editPassword2">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                        {...register("password2")}
                        type="password"
                        autoComplete={"new-password"}
                    />
                </Form.Group>
                <Form.Group controlId="editEmploymentName">
                    <Form.Label>Employment name</Form.Label>
                    <Form.Control
                        {...register("employment_name")}
                        type="text"
                        autoComplete={"organization"}
                    />
                </Form.Group>
                <Form.Group controlId="editContractName">
                    <Form.Label>Contract name</Form.Label>
                    <Form.Control {...register("contract_name")} type="text" />
                </Form.Group>
                <Form.Group controlId="editEmploymentFrom">
                    <Form.Label>Employment start</Form.Label>
                    <Form.Control
                        {...register("employment_from")}
                        type="date"
                        max={formatDate(new Date(), "yyyy-mm-dd")}
                    />
                </Form.Group>
                <Form.Group controlId="editEmploymentPayBand">
                    <Form.Label>Pay band</Form.Label>
                    <Form.Select
                        {...register("pay_group_id")}
                        disabled={payBands.length <= 1}
                    >
                        <>
                            {!getValues("pay_group_id") && (
                                <option>Select your pay band</option>
                            )}
                        </>
                        {payBands.map((x) => (
                            <option key={x.pay_group_id} value={x.pay_group_id}>
                                {x.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="editEmploymentWeeklyHours">
                    <Form.Label>Weekly hours</Form.Label>
                    <Form.Control
                        {...register("weekly_hours")}
                        type="number"
                        max={37.5}
                        min={0}
                        step={0.01}
                        placeholder="37.5"
                    />
                </Form.Group>
                <Button type="submit" disabled={isPending || !isValid}>
                    Register
                </Button>
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

export default Register;
