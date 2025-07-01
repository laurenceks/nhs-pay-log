import { fetchJson } from "./queryUtils";
import { queryOptions } from "@tanstack/react-query";
import { PayBandTable } from "../../../../types/lookupTypes";

export const getPayBandsFetch = async () => {
    return await fetchJson<PayBandTable>("/api/v1/private/payBands");
};

export const getPayBandsQueryOptions = queryOptions({
    queryKey: ["payBands"],
    queryFn: getPayBandsFetch,
});
