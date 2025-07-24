import { MutationOptions, queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { Employment } from "../../../../types/lookupTypes";
import { EmploymentEdit } from "../../../../types/commonTypes";
import { queryClient } from "../App";

export const getEmploymentsFetch = async () => {
    return await fetchJson<Employment[]>("/api/v1/private/employment");
};

export const patchEmployment = async (employment: EmploymentEdit) => {
    return await fetchJson(
        `/api/v1/private/employment/${employment.id}`,
        "PATCH",
        employment
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
    mutationFn: () => patchEmployment(employment),
    onSuccess: async () => {
        //invalidate everything as employment setting changes have far-reaching implications
        await queryClient.invalidateQueries();
        await queryClient.refetchQueries({ queryKey: ["employments"] });
        await queryClient.refetchQueries({ queryKey: ["contracts"] });
    },
});
