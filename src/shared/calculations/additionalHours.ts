import { makeToAlwaysLater } from "../utils/conversions";
import {
    calculateShiftHours,
    calculateShiftLength,
    isBankHoliday,
} from "./shiftLengths";
import {
    AdditionalHours,
    Overruns,
    ShiftTypes,
} from "../../../types/commonTypes";
import {
    absentShiftTypes,
    additionalHoursShiftTypes,
} from "../utils/shiftTypes";
import { Section2Shift } from "./section2";

export const calculateCumulativeAdditionalHours = (
    from: Date,
    log: Section2Shift[] = [],
    id?: string | number,
    employment_id?: string | number
) => {
    const prevMonday = new Date(from);
    prevMonday.setHours(0, 0, 0, 0);
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

    return log.reduce((acc, val) => {
        const valFrom = new Date(val.from);
        const valTo = makeToAlwaysLater(valFrom, val.actual_to).toObj;
        if (
            valFrom >= prevMonday &&
            valFrom < from &&
            ((!!id && !!val.id && id !== val.id) || (!id && !val.id)) &&
            ((!!employment_id &&
                !!val.employment_id &&
                employment_id === val.employment_id) ||
                (!employment_id && !val.employment_id))
        ) {
            if (additionalHoursShiftTypes.includes(val.type)) {
                return (
                    acc +
                    calculateShiftHours(valFrom, valTo, val.break_override)
                );
            } else if (val.overrun_type === "OT") {
                return (
                    acc +
                    calculateShiftHours(
                        makeToAlwaysLater(valFrom, val.planned_to).toObj,
                        valTo,
                        val.break_override
                    )
                );
            }
        }
        return acc;
    }, 0);
};

const calculateBankHolidayToil = (
    type: ShiftTypes,
    from: Date,
    to: Date,
    fromIsBankHoliday: boolean,
    toIsBankHoliday: boolean
) => {
    if (
        ["Normal", "OT", "TOIL"].includes(type) &&
        (fromIsBankHoliday || toIsBankHoliday)
    ) {
        if (fromIsBankHoliday && toIsBankHoliday) {
            return calculateShiftHours(from, to);
        } else if (fromIsBankHoliday) {
            //from time until midnight
            return calculateShiftLength(
                from,
                new Date(to).setHours(0, 0, 0, 0)
            );
        } else {
            //midnight until to time
            return calculateShiftLength(
                new Date(from).setHours(24, 0, 0, 0),
                to
            );
        }
    }
    return 0;
};

export const calculateAdditionalHours = (
    {
        id,
        from,
        planned_to,
        actual_to,
        employment_id,
        type,
        overrun_type,
        weeklyHoursMs,
        breakOverrideMs = null,
    }: {
        id?: string | number;
        from: Date;
        planned_to: Date;
        actual_to: Date;
        employment_id?: string | number;
        type: ShiftTypes;
        overrun_type: Overruns;
        weeklyHoursMs: number;
        breakOverrideMs?: number | null;
    },
    log: Section2Shift[]
) => {
    const additionalHoursBreakdown: AdditionalHours = {
        flat: 0,
        time_and_half: 0,
        double: 0,
        toil: 0,
        absent_hours: 0,
    };
    if (type && from && actual_to && planned_to) {
        const isAdditionalHoursShift = additionalHoursShiftTypes.includes(type);

        const fromObj = new Date(from);
        const plannedToObj = new Date(planned_to);
        const actualToObj = new Date(actual_to);

        const fromIsBankHoliday = isBankHoliday(fromObj);
        const toIsBankHoliday = isBankHoliday(actualToObj);

        const cumulativeAdditionalHours =
            type === "Bank"
                ? 0
                : calculateCumulativeAdditionalHours(
                      fromObj,
                      log,
                      id,
                      employment_id
                  );
        const plannedAdditionalHours = isAdditionalHoursShift
            ? calculateShiftHours(fromObj, planned_to, breakOverrideMs)
            : 0;

        const overrunHours =
            plannedToObj === actualToObj
                ? 0
                : calculateShiftLength(plannedToObj, actualToObj);

        const paidAdditionalHours =
            plannedAdditionalHours + (overrun_type === "OT" ? overrunHours : 0);

        if (absentShiftTypes.includes(type)) {
            additionalHoursBreakdown.absent_hours = calculateShiftHours(
                fromObj,
                plannedToObj,
                breakOverrideMs
            );
        } else if (paidAdditionalHours) {
            const weeklyOtThresholdHours = 1.35e8 - (weeklyHoursMs ?? 1.35e8); //37.5hrs fallback but allowing for 0

            additionalHoursBreakdown.toil += Math.min(
                weeklyOtThresholdHours,
                calculateBankHolidayToil(
                    type,
                    fromObj,
                    overrun_type === "OT" ? actual_to : planned_to,
                    fromIsBankHoliday,
                    toIsBankHoliday
                )
            );

            if (type === "OT" || type === "Normal") {
                additionalHoursBreakdown.flat = Math.max(
                    0,
                    Math.min(
                        paidAdditionalHours,
                        weeklyOtThresholdHours - cumulativeAdditionalHours
                    )
                );
                if (
                    paidAdditionalHours + cumulativeAdditionalHours >=
                    weeklyOtThresholdHours
                ) {
                    if (fromIsBankHoliday || toIsBankHoliday) {
                        if (fromIsBankHoliday && toIsBankHoliday) {
                            additionalHoursBreakdown.double = Math.max(
                                0,
                                paidAdditionalHours -
                                    additionalHoursBreakdown.flat
                            );
                        } else if (fromIsBankHoliday) {
                            //from time until midnight
                            additionalHoursBreakdown.double =
                                calculateShiftLength(
                                    fromObj,
                                    (overrun_type === "OT"
                                        ? actualToObj
                                        : plannedToObj
                                    ).setHours(0, 0, 0, 0)
                                );
                        } else {
                            //midnight until to time
                            additionalHoursBreakdown.double =
                                calculateShiftLength(
                                    fromObj.setHours(24, 0, 0, 0),
                                    overrun_type === "OT"
                                        ? actualToObj
                                        : plannedToObj
                                );
                        }
                    }

                    additionalHoursBreakdown.time_and_half = Math.max(
                        0,
                        paidAdditionalHours -
                            additionalHoursBreakdown.double -
                            additionalHoursBreakdown.flat
                    );
                }
            } else if (type === "Bank") {
                additionalHoursBreakdown.flat = Math.floor(
                    paidAdditionalHours * 1.12004801920768
                );
            }

            if (type === "TOIL") {
                additionalHoursBreakdown.toil += plannedAdditionalHours;
            }
        } else if (type === "Normal") {
            additionalHoursBreakdown.toil += calculateBankHolidayToil(
                type,
                from,
                planned_to,
                fromIsBankHoliday,
                toIsBankHoliday
            );
        }

        if (
            ["Normal", ...additionalHoursShiftTypes].includes(type) &&
            overrun_type === "TOIL"
        ) {
            additionalHoursBreakdown.toil += overrunHours;
        }
    }

    return additionalHoursBreakdown;
};
