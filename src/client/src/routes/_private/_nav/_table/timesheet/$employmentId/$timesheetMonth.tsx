import { stripQueryOptionsForEnsureQuery } from "../../../../../../queries/queryUtils";
import { createFileRoute } from "@tanstack/react-router";
import { ApiTimesheet } from "../../../../../../../../../types/commonTypes";
import { getTimesheetQueryOptions } from "../../../../../../queries/timesheetQueries";
import Timesheet from "../../../../../../components/timesheet/Timesheet";
import { Modal } from "react-bootstrap";

export const Route = createFileRoute(
    "/_private/_nav/_table/timesheet/$employmentId/$timesheetMonth"
)({
    loader: async ({ context, params }) => {
        const timesheet: ApiTimesheet = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(
                    getTimesheetQueryOptions(
                        Number(params.employmentId),
                        params.timesheetMonth
                    )
                )
            )
        ).data;
        return { timesheet };
    },
    component: Timesheet,
    errorComponent: () => <Modal show={true}>Something went wrong</Modal>,
});
