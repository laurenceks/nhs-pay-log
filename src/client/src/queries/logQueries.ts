import { MutationOptions, queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ShiftEdit } from "../../../../types/commonTypes";

export const getLogFetch = async () => {
    return await fetchJson("/api/v1/private/log");
};
export const getLogShiftFetch = async (shiftId: string) => {
    return await fetchJson(`/api/v1/private/log/${shiftId}`);
};
export const postLogShiftFetch = async (shift: ShiftEdit) => {
    return await fetchJson(`/api/v1/private/log`, "POST", shift);
};
export const patchLogShiftFetch = async (shift: ShiftEdit) => {
    return await fetchJson(`/api/v1/private/log/${shift.id}`, "PATCH", shift);
};
export const deleteLogShiftFetch = async (shift: ShiftEdit) => {
    return await fetchJson(`/api/v1/private/log/${shift.id}`, "DELETE", shift);
};
export const getLogQueryOptions = queryOptions({
    queryKey: ["log"],
    queryFn: getLogFetch,
});
export const getLogShiftQueryOptions = (shiftId: string) =>
    queryOptions({
        queryKey: ["log", shiftId],
        queryFn: () => getLogShiftFetch(shiftId),
    });
export const postLogShiftMutationOptions = (
    shift: ShiftEdit
): MutationOptions => ({
    mutationKey: ["log", "post"],
    mutationFn: () => postLogShiftFetch(shift),
});
export const patchLogShiftMutationOptions = (
    shift: ShiftEdit
): MutationOptions => ({
    mutationKey: ["log", "patch"],
    mutationFn: () => patchLogShiftFetch(shift),
});
export const deleteLogShiftMutationOptions = (
    shift: ShiftEdit
): MutationOptions => ({
    mutationKey: ["log", "delete"],
    mutationFn: () => deleteLogShiftFetch(shift),
});
