import { queryOptions } from "@tanstack/react-query";
import { fetchJson } from "./queryUtils";
import { ApiTimesheet, TimesheetOption } from "../../../../types/commonTypes";
import { queryClient } from "../../../shared/queryClient";

export const getTimesheetsFetch = async () => {
    return await fetchJson<TimesheetOption[]>("/api/v1/private/timesheet");
};

export const getTimesheetFetch = async (
    employmentId: number,
    payMonth: string
) => {
    return await fetchJson<ApiTimesheet>(
        `/api/v1/private/timesheet/${employmentId}/${payMonth}`
    );
};

export const invalidateTimesheetsQuery = async () =>
    await queryClient.invalidateQueries({
        queryKey: ["timesheets"],
        exact: true,
        type: "all",
    });

export const getTimesheetsQueryOptions = queryOptions({
    queryKey: ["timesheets"],
    queryFn: getTimesheetsFetch,
});

export const getTimesheetQueryOptions = (
    employmentId: number,
    payMonth: string
) =>
    queryOptions({
        queryKey: ["timesheet", employmentId, payMonth],
        queryFn: () => getTimesheetFetch(employmentId, payMonth),
    });
