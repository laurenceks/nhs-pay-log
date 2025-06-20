import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";

export const getLog = async () => {
    return await fetchJson("/api/v1/private/log");
};
export const getLogShift = async (shiftId: string) => {
    return await fetchJson(`/api/v1/private/log/${shiftId}`);
};
export const getLogQueryOptions = queryOptions({
    queryKey: ["log"],
    queryFn: getLog,
});
export const getLogShiftQueryOptions = (shiftId: string) =>
    queryOptions({
        queryKey: ["log", shiftId],
        queryFn: () => getLogShift(shiftId),
    });
