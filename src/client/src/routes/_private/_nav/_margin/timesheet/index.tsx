import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import { createFileRoute } from "@tanstack/react-router";
import { TimesheetOption } from "../../../../../../../../types/commonTypes";
import { getTimesheetListQueryOptions } from "../../../../../queries/timesheetQueries";
import TimesheetList from "../../../../../components/timesheet/TimesheetList";
import { getEmploymentsQueryOptions } from "../../../../../queries/employmentQueries";

export const Route = createFileRoute("/_private/_nav/_margin/timesheet/")({
    component: TimesheetList,
    loader: async ({ context }) => {
        const timesheetList: TimesheetOption[] = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getTimesheetListQueryOptions)
            )
        ).data;
        const employments = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getEmploymentsQueryOptions)
            )
        ).data;

        return { timesheetList, employments };
    },
});
