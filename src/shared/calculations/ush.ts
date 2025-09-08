import { isBankHoliday } from "./shiftLengths";
import { ShiftTypes, USH } from "../../../types/commonTypes";
import { addDaysToTimestamp, formatDate } from "../utils/formatDates";
import { Section2LogEntry } from "./section2";

export const calculateRawLowerRate = (from: Date, to: Date) => {
    // returns in ms the total time within the lower rate windows
    if (!from || !to) {
        return 0;
    }
    const fromTime = from.getTime();
    const toObj = new Date(to);
    const toTime = to.getTime();
    const fromDay = from.getDay();
    const toDay = to.getDay();

    if (
        (fromDay === 0 && toDay === 0) ||
        (isBankHoliday(from) && isBankHoliday(to)) ||
        (fromDay === 0 && isBankHoliday(to))
    ) {
        // only Sunday or BH
        return 0;
    }

    if (fromDay === 6 && toDay === 6) {
        //only Saturday
        return toTime - fromTime;
    }

    let lowerRateHours = 0;

    if ((fromDay === 6 && toDay === 0) || isBankHoliday(to)) {
        // Saturday into Sunday or into a bank holiday
        return toObj.setHours(0, 0, 0, 0) - fromTime;
    }

    if (
        (fromDay === 0 && toDay === 1) ||
        (isBankHoliday(from) && !isBankHoliday(to) && toDay > 0)
    ) {
        // Sunday into Monday or BH into non BH
        return (
            Math.min(toTime, toObj.setHours(6, 0, 0, 0)) -
            Math.max(fromTime, toObj.setHours(0, 0, 0, 0))
        );
    }

    const from2000 = from.setHours(20, 0, 0, 0);

    if (fromDay === 5 && toDay === 6) {
        // Friday into Saturday
        lowerRateHours = toTime - Math.max(from2000, fromTime);
    } else {
        const from0600 = from.setHours(6, 0, 0, 0);

        if (fromTime < from0600) {
            // start before 0600
            lowerRateHours += Math.min(from0600, toTime) - fromTime;
        }

        const from2400 = from.setHours(24, 0, 0, 0);

        if (
            (fromTime <= from2000 && toTime > from2000) ||
            fromTime > from2000
        ) {
            // from 2000 to midnight
            lowerRateHours +=
                Math.min(toTime, from2400) - Math.max(from2000, fromTime);
        }

        if (toTime > from2400) {
            // from midnight to 0600
            lowerRateHours +=
                Math.min(toTime, toObj.setHours(6, 0, 0, 0)) - from2400;
        }

        const to2000 = toObj.setHours(20, 0, 0, 0);

        if (toTime > to2000 && to2000 > from2400) {
            // end after 2000
            lowerRateHours += toTime - Math.max(to2000, fromTime);
        }
    }

    return lowerRateHours;
};

export const calculateRawHigherRate = (from: Date, to: Date) => {
    // calculate in ms the total time within the higher rate windows
    if (!from || !to) {
        return 0;
    }

    const fromTime = from.getTime();
    const toObj = new Date(to);
    const toTime = to.getTime();
    const fromDay = from.getDay();
    const toDay = to.getDay();

    if (
        fromDay !== 0 &&
        toDay !== 0 &&
        !isBankHoliday(from) &&
        !isBankHoliday(to)
    ) {
        // neither Sunday nor BH
        return 0;
    }

    if (
        (fromDay === 0 && toDay === 0) ||
        (isBankHoliday(from) && isBankHoliday(to)) ||
        (fromDay === 0 && isBankHoliday(to)) ||
        (isBankHoliday(from) && toDay === 0)
    ) {
        // all Sunday or BH
        return toTime - fromTime;
    }

    const to0000 = toObj.setHours(0, 0, 0, 0);

    if (fromDay === 6 || (!isBankHoliday(from) && isBankHoliday(to))) {
        // Saturday into Sunday or non-BH into BH
        return toTime - to0000;
    }
    if (fromDay === 0 || (isBankHoliday(from) && !isBankHoliday(to))) {
        // Sunday into Monday or BH into non-BH
        return to0000 - fromTime;
    }

    return 0;
};

const ushTypes: ShiftTypes[] = ["Normal", "OT", "AL", "Absent (TOIL)", "Bank"];

export const calculateUsh = (
    from: Date,
    to: Date,
    type: ShiftTypes = "Normal",
    hoursOverThresholdMs = 0,
    weeklyHoursMs = 1.35e8, //37.5hrs
    breakOverrideMs: number | null = null,
    log: Section2LogEntry[] = [],
    halfIsAllUsh: boolean = false,
    breakInHigherRate: boolean = true
): USH => {
    let lowerRateRaw = 0;
    let higherRateRaw = 0;
    if (from && to && ushTypes.includes(type)) {
        const fromObj = new Date(from);
        const toObj = new Date(to);

        lowerRateRaw = calculateRawLowerRate(
            new Date(fromObj),
            new Date(toObj)
        );
        higherRateRaw = calculateRawHigherRate(
            new Date(fromObj),
            new Date(toObj)
        );

        const totalUshRaw = lowerRateRaw + higherRateRaw;
        let shiftLength = toObj.getTime() - fromObj.getTime();

        const remainingBreak =
            breakOverrideMs === null || breakOverrideMs === undefined
                ? shiftLength > 21600000
                    ? 1800000
                    : 0
                : breakOverrideMs;

        if (hoursOverThresholdMs) {
            //recalculate USH based on new end
            toObj.setTime(toObj.getTime() + hoursOverThresholdMs * -1);
            lowerRateRaw = calculateRawLowerRate(
                new Date(fromObj),
                new Date(toObj)
            );
            higherRateRaw = calculateRawHigherRate(
                new Date(fromObj),
                new Date(toObj)
            );
        }

        if (
            totalUshRaw > shiftLength / 2 ||
            (halfIsAllUsh && totalUshRaw >= shiftLength / 2)
        ) {
            // more than half the shift is USH
            if (!higherRateRaw) {
                // only lower rate
                lowerRateRaw = Math.max(
                    0,
                    shiftLength - remainingBreak - hoursOverThresholdMs
                );
            } else if (!lowerRateRaw) {
                // only higher rate
                higherRateRaw = Math.max(
                    0,
                    shiftLength - remainingBreak - hoursOverThresholdMs
                );
            } else {
                if (hoursOverThresholdMs) {
                    // update shift length to match USH length with OT hours deducted
                    shiftLength = toObj.getTime() - fromObj.getTime();
                }
                if (breakInHigherRate) {
                    // take break from more expensive side
                    const segmentBreak = Math.min(
                        higherRateRaw,
                        remainingBreak
                    );
                    higherRateRaw = shiftLength - lowerRateRaw - segmentBreak;
                    lowerRateRaw -= remainingBreak - segmentBreak;
                } else {
                    // take break from less expensive side
                    const segmentBreak = Math.min(lowerRateRaw, remainingBreak);
                    lowerRateRaw = shiftLength - higherRateRaw - segmentBreak;
                    higherRateRaw -= remainingBreak - segmentBreak;
                }
            }
        }
    } else if (type === "AL (relief)" || type === "Absent (TOIL relief)") {
        const averagePeriodStart = formatDate(
            addDaysToTimestamp(from, -91),
            "yyyy-mm-dd"
        );
        const fromSortingString = formatDate(from, "yyyy-mm-dd");
        const totalUsh = { lower: 0, higher: 0 };
        for (const shift of log) {
            if (
                shift.date < averagePeriodStart ||
                shift.type === "AL (relief)" ||
                shift.type === "Absent (TOIL relief)"
            ) {
                continue;
            }
            if (shift.date >= fromSortingString) {
                break;
            }
            totalUsh.lower = totalUsh.lower + shift.lower_rate;
            totalUsh.higher = totalUsh.higher + shift.higher_rate;
        }
        const shiftLength = new Date(to).getTime() - new Date(from).getTime();
        lowerRateRaw = Math.round(
            (totalUsh.lower / (weeklyHoursMs * 13)) * shiftLength
        );
        higherRateRaw = Math.round(
            (totalUsh.higher / (weeklyHoursMs * 13)) * shiftLength
        );
    }

    return {
        lower_rate: Math.max(0, lowerRateRaw),
        higher_rate: Math.max(0, higherRateRaw),
    };
};
