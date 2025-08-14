import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ApiPay, ApiPayslip } from "../../../../types/commonTypes";
import { queryClient } from "../../../shared/queryClient";

export const getPayFetch = async () => {
    return await fetchJson<ApiPay[]>("/api/v1/private/pay");
};

export const getPayslipFetch = async (
    employmentId: number,
    payMonth: string
) => {
    return await fetchJson<ApiPayslip[]>(
        `/api/v1/private/pay/${employmentId}/${payMonth}`
    );
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
export const getPayslipQueryOptions = (
    employmentId: number,
    payMonth: string
) =>
    queryOptions({
        queryKey: ["payslip", employmentId, payMonth],
        queryFn: () => getPayslipFetch(employmentId, payMonth),
    });
