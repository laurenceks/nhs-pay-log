import { Button, Form } from "react-bootstrap";
import { ChangeEvent, useState } from "react";

const Login = () => {
    const [formState, setFormState] = useState({ email: "", password: "" });
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) =>
        setFormState((prevState) => ({
            ...prevState,
            [e.target.dataset.field as string]: e.target.value,
        }));
    return (
        <div className="position-relative">
            <Form className="d-flex flex-column gap-3">
                <h3 className="mb-0">Please log in</h3>
                <Form.Group controlId="editDate">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder=""
                        value={formState.email}
                        data-field={"email"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Form.Group controlId="editStart">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder=""
                        value={formState.password}
                        data-field={"password"}
                        onChange={changeHandler}
                    />
                </Form.Group>
                <Button type="submit">Log in</Button>
            </Form>
        </div>
    );
};

export default Login;
