import { fetchJson } from "./queryUtils";
import { ClientUserDetails } from "../../../../types/commonTypes";
import { toast } from "react-hot-toast";

export const patchUserFetch = async (details: ClientUserDetails) => {
    return await fetchJson(`/api/v1/private/user`, "PATCH", details);
};

export const patchEmploymentMutationOptions = () => ({
    mutationKey: ["user", "patch"],
    mutationFn: (details: ClientUserDetails) => patchUserFetch(details),
    onSuccess: async () => {
        toast.success("Your details have been updated");
    },
});
