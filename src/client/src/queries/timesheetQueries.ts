import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ApiTimesheet, TimesheetOption } from "../../../../types/commonTypes";
import { queryClient } from "../../../shared/queryClient";

export const getTimesheetListFetch = async () => {
    return await fetchJson<TimesheetOption[]>("/api/v1/private/timesheet");
};

export const getTimesheetFetch = async (
    employmentId: number,
    timesheetMonth: string
) => {
    return await fetchJson<ApiTimesheet>(
        `/api/v1/private/timesheet/${employmentId}/${timesheetMonth}`
    );
};

export const invalidateTimesheetListQuery = async () =>
    await queryClient.invalidateQueries({
        queryKey: ["timesheetList"],
        exact: true,
        type: "all",
    });

export const getTimesheetListQueryOptions = queryOptions({
    queryKey: ["timesheetList"],
    queryFn: getTimesheetListFetch,
});

export const getTimesheetQueryOptions = (
    employmentId: number,
    timesheetMonth: string
) =>
    queryOptions({
        queryKey: ["timesheet", employmentId, timesheetMonth],
        queryFn: () => getTimesheetFetch(employmentId, timesheetMonth),
    });
