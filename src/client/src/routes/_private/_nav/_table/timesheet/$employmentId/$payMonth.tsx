import { ApiTimesheet } from "../../../../../../../../../types/commonTypes";
import { createFileRoute } from "@tanstack/react-router";
import { stripQueryOptionsForEnsureQuery } from "../../../../../../queries/queryUtils";
import { getTimesheetQueryOptions } from "../../../../../../queries/timesheetQueries";
import Timesheet from "../../../../../../components/timesheet/Timesheet";
import { Modal } from "react-bootstrap";

export const Route = createFileRoute(
    "/_private/_nav/_table/timesheet/$employmentId/$payMonth"
)({
    loader: async ({ context, params }) => {
        const timesheet: ApiTimesheet[] = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(
                    getTimesheetQueryOptions(
                        Number(params.employmentId),
                        params.payMonth
                    )
                )
            )
        ).data;
        return { timesheet };
    },
    component: Timesheet,
    errorComponent: () => <Modal show={true}>Something went wrong</Modal>,
});
