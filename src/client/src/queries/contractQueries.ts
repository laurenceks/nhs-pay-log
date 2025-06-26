import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { Contract } from "../../../../types/commonTypes";

export const getContractsFetch = async () => {
    return await fetchJson<Contract[]>("/api/v1/private/contract");
};

export const getContractsQueryOptions = queryOptions({
    queryKey: ["contracts"],
    queryFn: getContractsFetch,
});
