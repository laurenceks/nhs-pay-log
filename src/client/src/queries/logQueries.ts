import { MutationOptions, queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { LogShift, ShiftEdit } from "../../../../types/commonTypes";
import { queryClient } from "../App";

export const getLogFetch = async () => {
    return await fetchJson<LogShift[]>("/api/v1/private/log");
};
export const getLogShiftFetch = async (shiftId: number) => {
    return await fetchJson<LogShift>(`/api/v1/private/log/${shiftId}`);
};
export const postLogShiftFetch = async (shift: ShiftEdit) => {
    return await fetchJson(`/api/v1/private/log`, "POST", shift);
};
export const patchLogShiftFetch = async (shift: ShiftEdit) => {
    return await fetchJson(`/api/v1/private/log/${shift.id}`, "PATCH", shift);
};
export const deleteLogShiftFetch = async (shiftId: number) => {
    return await fetchJson(`/api/v1/private/log/${shiftId}`, "DELETE");
};

const invalidateLogQuery = async () =>
    await queryClient.invalidateQueries({
        queryKey: ["log"],
        exact: true,
        type: "all",
    });

const invalidateLogShiftQuery = async (shiftId: number) =>
    //TODO mark all shifts in same week as stale
    await queryClient.invalidateQueries({
        queryKey: ["log", shiftId],
        type: "all",
    });

export const getLogQueryOptions = queryOptions({
    queryKey: ["log"],
    queryFn: getLogFetch,
});
export const getLogShiftQueryOptions = (shiftId: number) =>
    queryOptions({
        queryKey: ["log", shiftId],
        queryFn: () => getLogShiftFetch(shiftId),
    });
export const postLogShiftMutationOptions = (
    shift: ShiftEdit
): MutationOptions => {
    return {
        mutationKey: ["log", "post"],
        mutationFn: () => postLogShiftFetch(shift),
        onSuccess: async () => {
            await invalidateLogQuery();
        },
    };
};
export const patchLogShiftMutationOptions = (
    shift: ShiftEdit
): MutationOptions => ({
    mutationKey: ["log", "patch"],
    mutationFn: () => patchLogShiftFetch(shift),
    onSuccess: async () => {
        await invalidateLogQuery();
        await invalidateLogShiftQuery(shift.id);
    },
});
export const deleteLogShiftMutationOptions = (
    shiftId: number
): MutationOptions => ({
    mutationKey: ["log", "delete"],
    mutationFn: () => deleteLogShiftFetch(shiftId),
    onSuccess: async () => {
        await invalidateLogQuery();
        await invalidateLogShiftQuery(shiftId);
    },
});
