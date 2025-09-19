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
    break_override?: number | null;
}

export type LeaveReliefUSHOption =
    | "best"
    | "average13"
    | "average52"
    | "flat"
    | "none";

export const calculateSection2 = (
    {
        from,
        planned_to,
        actual_to,
        type = "Normal",
        overrun_type = "OT",
        id = undefined,
        employment_id = undefined,
        breakOverrideMs = null,
        reliefLeaveType = "best",
        log = [],
    }: {
        from: Date | string | number;
        planned_to: Date | string | number;
        actual_to?: Date | string | number;
        type?: ShiftTypes;
        overrun_type?: Overruns;
        id?: string | number;
        employment_id?: string | number;
        breakOverrideMs?: number | null;
        reliefLeaveType?: LeaveReliefUSHOption;
        log?: Section2LogEntry[];
    },
    {
        weeklyHoursMs = 135000000, //37.5
        halfIsAllUsh = false,
        breakInHigherRate = true,
    }: {
        weeklyHoursMs?: number;
        halfIsAllUsh?: boolean;
        breakInHigherRate?: boolean;
    }
): Section2 => {
    if (
        !validateTimestamp(from) ||
        !validateTimestamp(planned_to) ||
        (!!actual_to && !validateTimestamp(actual_to))
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
    const actualToObj = actual_to
        ? makeToAlwaysLater(plannedToObj, actual_to).toObj
        : new Date(plannedToObj);
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
            breakOverrideMs,
        },
        log
    );

    const ush = calculateUsh(
        fromObj,
        plannedToObj,
        type,
        additionalHours.time_and_half + additionalHours.double,
        weeklyHoursMs,
        breakOverrideMs,
        log,
        halfIsAllUsh,
        breakInHigherRate,
        overrun_type,
        actualToObj,
        reliefLeaveType
    );
    return { ...additionalHours, ...ush };
};
