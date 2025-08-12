import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import { createFileRoute } from "@tanstack/react-router";
import { TimesheetOption } from "../../../../../../../../types/commonTypes";
import { getTimesheetsQueryOptions } from "../../../../../queries/timesheetQueries";
import Timesheets from "../../../../../components/timesheet/Timesheets";

export const Route = createFileRoute("/_private/_nav/_table/timesheet/")({
    component: Timesheets,
    loader: async ({ context }) => {
        const timesheets: TimesheetOption[] = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(getTimesheetsQueryOptions)
            )
        ).data;
        return { timesheets };
    },
});
