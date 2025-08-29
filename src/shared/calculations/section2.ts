import { validateTimestamp } from "../utils/validateTimestamp";
import { Overruns, ShiftTypes } from "../../../types/commonTypes";
import { makeToAlwaysLater } from "../utils/conversions";
import { calculateAdditionalHours } from "./additionalHours";
import { calculateUsh } from "./ush";

interface Section2 {
    absent_hours: number;
    double: number;
    flat: number;
    higher_rate: number;
    lower_rate: number;
    time_and_half: number;
    toil: number;
}

export interface Section2LogEntry extends Section2 {
    actual_to: string;
    date: string;
    id?: string | number;
    employment_id?: string | number;
    from: string;
    overrun_type?: Overruns;
    planned_to: string;
    type: ShiftTypes;
}

export const calculateSection2 = ({
    from,
    planned_to,
    actual_to,
    type = "Normal",
    overrun_type = "OT",
    id = undefined,
    employment_id = undefined,
    weeklyHoursMs = 135000000,
    log = [],
}: {
    from: Date | string | number;
    planned_to: Date | string | number;
    actual_to: Date | string | number;
    type?: ShiftTypes;
    overrun_type?: Overruns;
    id?: string | number;
    employment_id?: string | number;
    weeklyHoursMs?: number;
    log?: Section2LogEntry[];
}): Section2 => {
    if (
        !validateTimestamp(from) ||
        !validateTimestamp(planned_to) ||
        !validateTimestamp(actual_to)
    ) {
        console.warn(
            "Invalid datetime passed - function will return 0 for all fields. Datetimes must be a Date object, unix time or a string in yyyy-mm-dd or ISO format."
        );
        return {
            flat: 0,
            higher_rate: 0,
            time_and_half: 0,
            toil: 0,
            lower_rate: 0,
            double: 0,
            absent_hours: 0,
        };
    }
    const { fromObj, toObj: plannedToObj } = makeToAlwaysLater(
        from,
        planned_to
    );
    const { toObj: actualToObj } = makeToAlwaysLater(plannedToObj, actual_to);
    const additionalHours = calculateAdditionalHours(
        {
            from: fromObj,
            planned_to: plannedToObj,
            actual_to: actualToObj,
            type,
            overrun_type,
            id,
            employment_id,
            weeklyHoursMs: weeklyHoursMs,
        },
        log
    );

    const ush = calculateUsh(
        fromObj,
        overrun_type === "OT" ? actualToObj : plannedToObj,
        type,
        additionalHours.time_and_half + additionalHours.double,
        weeklyHoursMs,
        log
    );
    return { ...additionalHours, ...ush };
};
