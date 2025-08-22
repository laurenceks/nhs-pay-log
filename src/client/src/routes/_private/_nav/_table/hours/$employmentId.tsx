import { createFileRoute } from "@tanstack/react-router";
import { stripQueryOptionsForEnsureQuery } from "../../../../../queries/queryUtils";
import { Modal } from "react-bootstrap";
import { getHoursQueryOptions } from "../../../../../queries/hoursQueries";
import Hours from "../../../../../components/hours/Hours";
import { msToDecimalHours } from "../../../../../../../shared/utils/conversions";
import { roundTo } from "round-to";
import { ApiHours } from "../../../../../../../../types/commonTypes";

export const Route = createFileRoute(
    "/_private/_nav/_table/hours/$employmentId"
)({
    loader: async ({ context, params }) => {
        const hours: ApiHours[] = (
            await context.queryClient.ensureQueryData(
                stripQueryOptionsForEnsureQuery(
                    getHoursQueryOptions(Number(params.employmentId))
                )
            )
        ).data.map((x) => {
            return {
                ...x,
                absent_hours: roundTo(msToDecimalHours(x.absent_hours), 3),
                actual_hours: roundTo(msToDecimalHours(x.actual_hours), 3),
                core_hours: roundTo(msToDecimalHours(x.core_hours), 3),
                double: roundTo(msToDecimalHours(x.double), 3),
                extra_hours: roundTo(msToDecimalHours(x.extra_hours), 3),
                flat: roundTo(msToDecimalHours(x.flat), 3),
                higher_rate: roundTo(msToDecimalHours(x.higher_rate), 3),
                lower_rate: roundTo(msToDecimalHours(x.lower_rate), 3),
                normal_hours: roundTo(msToDecimalHours(x.normal_hours), 3),
                overrun_hours: roundTo(msToDecimalHours(x.overrun_hours), 3),
                planned_hours: roundTo(msToDecimalHours(x.planned_hours), 3),
                time_and_half: roundTo(msToDecimalHours(x.time_and_half), 3),
                toil: roundTo(msToDecimalHours(x.toil), 3),
                worked_hours: roundTo(msToDecimalHours(x.worked_hours), 3),
                weekly_hours: roundTo(msToDecimalHours(x.weekly_hours), 3),
                weekly_hours_diff: roundTo(
                    msToDecimalHours(x.weekly_hours_diff),
                    3
                ),
            };
        });
        return { hours };
    },
    component: Hours,
    errorComponent: () => <Modal show={true}>Something went wrong</Modal>,
});
