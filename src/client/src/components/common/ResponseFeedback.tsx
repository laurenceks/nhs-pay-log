import { ApiResponse } from "../../../../../types/responseTypes";

const ResponseFeedback = ({
    response,
    error,
    isPending,
}: {
    response?: Omit<ApiResponse, "title"> | null;
    error?: Error | null;
    isPending: boolean;
}) => {
    return (
        !isPending &&
        (!!response || !!error) && (
            <div
                className={`bg-${response?.success ? "success" : "danger"} text-white px-3 py-2 text-center w-100 rounded d-flex small justify-content-center`}
            >
                {response?.message || error?.message}
            </div>
        )
    );
};
export default ResponseFeedback;
