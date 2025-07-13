import { FieldErrors } from "react-hook-form";

const FormFeedback = ({
    show,
    errors,
}: {
    errors?: FieldErrors;
    show: boolean;
}) => {
    const errorsArray = Object.values(errors || []);
    return (
        show && (
            <div
                className={`bg-danger text-white px-3 py-2 text-center w-100 rounded d-flex small justify-content-center d-flex flex-column gap-2`}
            >
                {errorsArray.map((x) => (
                    <p className="mb-0" key={(x?.ref as HTMLInputElement).id}>
                        {x?.message as string}
                    </p>
                ))}
            </div>
        )
    );
};
export default FormFeedback;
