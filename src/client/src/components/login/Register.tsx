import { Button, Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { postRegisterFetch } from "../../queries/loginQueries";
import { Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { formatDate } from "../../../../shared/utils/formatDates";
import ResponseFeedback from "../common/ResponseFeedback";
import { useForm } from "react-hook-form";
import FormFeedback from "../common/FormFeedback";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidationSchema } from "../../../../shared/validationSchemas/registerValidationSchema";
import { calculatePersonalAllowance } from "@saving-tool/hmrc-income-tax";
import { toast } from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const payBands = useLoaderData({ from: "/_public/_login/register" });
    const {
        register,
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
            weekly_hours: 37.5,
            pension_perc: 0,
            personal_allowance: calculatePersonalAllowance({
                taxableAnnualIncome: 0,
            }),
            student_loan: "",
            hca_group_id: "",
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
                toast.success(
                    "Your account has been created, please verify your email address to login",
                    { id: "register", duration: 10000 }
                );
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
                        {payBands.map((x) => (
                            <option key={x.pay_group_id} value={x.pay_group_id}>
                                {x.label}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="editHca">
                    <Form.Label>High Cost Area (HCA) type</Form.Label>
                    <Form.Select {...register("hca_group_id")}>
                        <option value={""}>None</option>
                        <option value={"3"}>Fringe</option>
                        <option value={"2"}>Outer London</option>
                        <option value={"1"}>Inner London</option>
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
                <Form.Group controlId="editPesnsionPerc">
                    <Form.Label>Pension %</Form.Label>
                    <Form.Control
                        {...register("pension_perc")}
                        type="number"
                        max={100}
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                    />
                </Form.Group>
                <Form.Group controlId="editPersonalAllowance">
                    <Form.Label>Personal allowance</Form.Label>
                    <Form.Control
                        {...register("personal_allowance")}
                        type="number"
                        min={0}
                        max={999999}
                        step={1}
                        placeholder="0"
                    />
                </Form.Group>
                <Form.Group controlId="editStudentLoan">
                    <Form.Label>Student loan type</Form.Label>
                    <Form.Select {...register("student_loan")}>
                        <option value={""}>None</option>
                        <option value={"1"}>1</option>
                        <option value={"2"}>2</option>
                        <option value={"4"}>4</option>
                        <option value={"5"}>5</option>
                        <option value={"6"}>Postgrad</option>
                    </Form.Select>
                </Form.Group>
                <Button type="submit" disabled={isPending || !isValid}>
                    Create account
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
                <Link to={"/login"} className="small">
                    Back to login
                </Link>
            </Form>
        </div>
    );
};

export default Register;
