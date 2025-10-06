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

export interface Section2Shift extends Section2 {
    actual_to: string;
    actual_hours: number; //ms
    break_override?: number | null;
    date: string;
    employment_id?: string | number;
    from: string;
    id?: string | number;
    overrun_hours?: number; //ms
    overrun_type?: Overruns;
    planned_to: string;
    type: ShiftTypes;
}

export type LeaveReliefUsh =
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
        shifts = [],
    }: {
        from: Date | string | number;
        planned_to: Date | string | number;
        actual_to?: Date | string | number;
        type?: ShiftTypes;
        overrun_type?: Overruns;
        id?: string | number;
        employment_id?: string | number;
        breakOverrideMs?: number | null;
        shifts?: Section2Shift[];
    },
    {
        weeklyHoursMs = 135000000, //37.5
        halfIsAllUsh = false,
        breakInHigherRate = true,
        leaveReliefUshType = "best",
    }: {
        weeklyHoursMs?: number;
        halfIsAllUsh?: boolean;
        breakInHigherRate?: boolean;
        leaveReliefUshType?: LeaveReliefUsh;
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
        shifts
    );

    const ush = calculateUsh({
        from: fromObj,
        plannedTo: plannedToObj,
        type: type,
        hoursOverThresholdMs:
            additionalHours.time_and_half + additionalHours.double,
        breakOverrideMs: breakOverrideMs,
        shifts: shifts,
        halfIsAllUsh: halfIsAllUsh,
        breakInHigherRate: breakInHigherRate,
        overrunType: overrun_type,
        actualTo: actualToObj,
        leaveReliefUshType: leaveReliefUshType,
        employment_id: employment_id,
    });
    return { ...additionalHours, ...ush };
};
