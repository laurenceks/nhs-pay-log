import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { Employment } from "../../../../types/lookupTypes";

export const getEmploymentsFetch = async () => {
    return await fetchJson<Employment[]>("/api/v1/private/employment");
};

export const getEmploymentsQueryOptions = queryOptions({
    queryKey: ["employments"],
    queryFn: getEmploymentsFetch,
});
