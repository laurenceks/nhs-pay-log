import { useMutation } from "@tanstack/react-query";
import { Button, Form } from "react-bootstrap";
import { patchEmploymentMutationOptions } from "../../../queries/userQueries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerValidationSchema } from "../../../../../shared/validationSchemas/registerValidationSchema";
import { useRouteContext } from "@tanstack/react-router";

const SettingsUser = () => {
    const { auth } = useRouteContext({ strict: false });

    const { mutate, isPending } = useMutation({
        ...patchEmploymentMutationOptions(),
    });

    const {
        register,
        formState: { isValid, errors },
        handleSubmit,
    } = useForm({
        mode: "onChange",
        defaultValues: {
            first_name: auth?.user?.first_name || "",
            last_name: auth?.user?.last_name || "",
        },
        resolver: zodResolver(
            registerValidationSchema.pick({
                first_name: true,
                last_name: true,
            })
        ),
    });

    return (
        <>
            <h2>Details</h2>
            <Form
                className="d-flex flex-wrap gap-3 align-items-end"
                onSubmit={handleSubmit((data) => {
                    mutate(data);
                })}
            >
                <Form.Group controlId="editFirstName">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        {...register("first_name")}
                        type="text"
                        autoComplete={"given-name"}
                        isInvalid={!!errors?.first_name}
                    />
                </Form.Group>
                <Form.Group controlId="editLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        {...register("last_name")}
                        type="text"
                        autoComplete={"family-name"}
                        isInvalid={!!errors?.last_name}
                    />
                </Form.Group>
                <Button type="submit" disabled={isPending || !isValid}>
                    Update details
                </Button>
            </Form>
        </>
    );
};

export default SettingsUser;
