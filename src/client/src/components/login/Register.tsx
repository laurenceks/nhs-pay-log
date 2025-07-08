import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postRegisterFetch } from "../../queries/loginQueries";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { formatDate } from "../../../../shared/utils/formatDates";
import ResponseFeedback from "../common/ResponseFeedback";

const Register = () => {
    const navigate = useNavigate();
    const payBands = useLoaderData({ from: "/_public/_login/register" });
    const [formState, setFormState] = useState({
        email: "",
        password1: "",
        password2: "",
        pay_group_id: "",
        employment_from: "",
        employment_name: "My job",
        contract_name: "My contract",
        weekly_hours: 37.5,
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
                <h3 className="mb-0">Register</h3>
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
                <Form.Group controlId="editPassword1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        value={formState.password1}
                        data-field={"password1"}
                        onChange={changeHandler}
                        autoComplete={"new-password"}
                    />
                </Form.Group>
                <Form.Group controlId="editPassword2">
                    <Form.Label>Confirm password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        value={formState.password2}
                        data-field={"password2"}
                        onChange={changeHandler}
                        autoComplete={"new-password"}
                    />
                </Form.Group>
                <Form.Group controlId="editEmploymentName">
                    <Form.Label>Employment name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="My job"
                        value={formState.employment_name}
                        data-field={"employment_name"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Form.Group controlId="editContractName">
                    <Form.Label>Employment name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="My contract"
                        value={formState.contract_name}
                        data-field={"contract_name"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Form.Group controlId="editEmploymentFrom">
                    <Form.Label>Employment start</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder=""
                        max={formatDate(new Date(), "yyyy-mm-dd")}
                        value={formState.employment_from}
                        data-field={"employment_from"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Form.Group controlId="editEmploymentPayBand">
                    <Form.Label>Pay band</Form.Label>
                    <Form.Select
                        value={formState?.pay_group_id}
                        data-field={"pay_group_id"}
                        onChange={changeHandler}
                        disabled={payBands.length <= 1}
                    >
                        <>
                            {!formState?.pay_group_id && (
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
                        type="number"
                        max={37.5}
                        min={0}
                        step={0.01}
                        placeholder="37.5"
                        value={formState.weekly_hours}
                        data-field={"weekly_hours"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    disabled={
                        isPending ||
                        !formState.email ||
                        !formState.password1 ||
                        !formState.password2 ||
                        !formState.employment_name ||
                        !formState.employment_from ||
                        !formState.pay_group_id ||
                        !formState.weekly_hours ||
                        formState.password1 !== formState.password2
                    }
                >
                    Register
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

export default Register;
