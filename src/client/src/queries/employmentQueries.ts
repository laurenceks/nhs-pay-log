import { MutationOptions, queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { Employment } from "../../../../types/lookupTypes";
import { EmploymentEdit } from "../../../../types/commonTypes";
import { queryClient } from "../App";

export const getEmploymentsFetch = async () => {
    return await fetchJson<Employment[]>("/api/v1/private/employment");
};

export const postEmploymentFetch = async () => {
    return await fetchJson(`/api/v1/private/employment`, "POST");
};
export const patchEmploymentFetch = async (employment: EmploymentEdit) => {
    return await fetchJson(
        `/api/v1/private/employment/${employment.id}`,
        "PATCH",
        employment
    );
};

export const deleteEmploymentFetch = async (employmentId: Employment["id"]) => {
    return await fetchJson(
        `/api/v1/private/employment/${employmentId}`,
        "DELETE"
    );
};

export const getEmploymentsQueryOptions = queryOptions({
    queryKey: ["employments"],
    queryFn: getEmploymentsFetch,
});

export const patchEmploymentMutationOptions = (
    employment: EmploymentEdit
): MutationOptions => ({
    mutationKey: ["employment", "patch"],
    mutationFn: () => patchEmploymentFetch(employment),
    onSuccess: async () => {
        //invalidate everything as employment setting changes have far-reaching implications
        await queryClient.invalidateQueries();
        await queryClient.refetchQueries({ queryKey: ["employments"] });
        await queryClient.refetchQueries({ queryKey: ["contracts"] });
    },
});
export const postEmploymentMutationOptions = (): MutationOptions => ({
    mutationKey: ["employment", "post"],
    mutationFn: postEmploymentFetch,
    onSuccess: async () => {
        //fetch contracts first to avoid errors in client (employments with no contract)
        await queryClient.refetchQueries({ queryKey: ["contracts"] });
        await queryClient.refetchQueries({ queryKey: ["employments"] });
    },
});
export const deleteEmploymentMutationOptions = (
    employmentId: Employment["id"]
): MutationOptions => ({
    mutationKey: ["employment", "delete"],
    mutationFn: () => deleteEmploymentFetch(employmentId),
    onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: ["employments"] });
        await queryClient.refetchQueries({ queryKey: ["contracts"] });
    },
});
