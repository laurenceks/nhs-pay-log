import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ApiPay } from "../../../../types/commonTypes";
import { queryClient } from "../App";

export const getPayFetch = async () => {
    return await fetchJson<ApiPay[]>("/api/v1/private/pay");
};

export const invalidatePayQuery = async () =>
    await queryClient.invalidateQueries({
        queryKey: ["pay"],
        exact: true,
        type: "all",
    });

export const getPayQueryOptions = queryOptions({
    queryKey: ["pay"],
    queryFn: getPayFetch,
});
