import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ShiftExtra } from "../../../../types/commonTypes";

export const getExtrasFetch = async () => {
    return await fetchJson<ShiftExtra[]>("/api/v1/private/extra");
};

export const getExtrasQueryOptions = queryOptions({
    queryKey: ["extras"],
    queryFn: getExtrasFetch,
});
