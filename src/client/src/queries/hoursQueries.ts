import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ApiHours } from "../../../../types/commonTypes";
import { queryClient } from "../../../shared/queryClient";

export const getHoursFetch = async (employmentId: number) => {
    return await fetchJson<ApiHours[]>(`/api/v1/private/hours/${employmentId}`);
};

export const invalidatePayQuery = async (employmentId: string) =>
    await queryClient.invalidateQueries({
        queryKey: ["hours", employmentId],
        exact: true,
        type: "all",
    });

export const getHoursQueryOptions = (employmentId: number) =>
    queryOptions({
        queryKey: ["hours", employmentId],
        queryFn: () => getHoursFetch(employmentId),
    });
