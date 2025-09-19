import { isBankHoliday } from "./shiftLengths";
import { Overruns, ShiftTypes, USH } from "../../../types/commonTypes";
import { addDaysToTimestamp, formatDate } from "../utils/formatDates";
import { LeaveReliefUsh, Section2LogEntry } from "./section2";

export const calculateRawLowerRate = (from: Date, to: Date) => {
    // returns in ms the total time within the lower rate windows
    if (!from || !to) {
        return 0;
    }
    const fromObj = new Date(from);
    const toObj = new Date(to);
    const fromTime = fromObj.getTime();
    const toTime = toObj.getTime();
    const fromDay = fromObj.getDay();
    const toDay = toObj.getDay();

    if (
        (fromDay === 0 && toDay === 0) ||
        (isBankHoliday(fromObj) && isBankHoliday(toObj)) ||
        (fromDay === 0 && isBankHoliday(toObj))
    ) {
        // only Sunday or BH
        return 0;
    }

    if (fromDay === 6 && toDay === 6) {
        //only Saturday
        return toTime - fromTime;
    }

    let lowerRateHours = 0;

    if ((fromDay === 6 && toDay === 0) || isBankHoliday(toObj)) {
        // Saturday into Sunday or into a bank holiday
        return toObj.setHours(0, 0, 0, 0) - fromTime;
    }

    if (
        (fromDay === 0 && toDay === 1) ||
        (isBankHoliday(fromObj) && !isBankHoliday(toObj) && toDay > 0)
    ) {
        // Sunday into Monday or BH into non BH
        return (
            Math.min(toTime, toObj.setHours(6, 0, 0, 0)) -
            Math.max(fromTime, toObj.setHours(0, 0, 0, 0))
        );
    }

    const from2000 = fromObj.setHours(20, 0, 0, 0);

    if (fromDay === 5 && toDay === 6) {
        // Friday into Saturday
        lowerRateHours = toTime - Math.max(from2000, fromTime);
    } else {
        const from0600 = fromObj.setHours(6, 0, 0, 0);

        if (fromTime < from0600) {
            // start before 0600
            lowerRateHours += Math.min(from0600, toTime) - fromTime;
        }

        const from2400 = fromObj.setHours(24, 0, 0, 0);

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
    const fromObj = new Date(from);
    const toObj = new Date(to);
    const fromTime = fromObj.getTime();
    const toTime = toObj.getTime();
    const fromDay = fromObj.getDay();
    const toDay = toObj.getDay();

    if (
        fromDay !== 0 &&
        toDay !== 0 &&
        !isBankHoliday(fromObj) &&
        !isBankHoliday(toObj)
    ) {
        // neither Sunday nor BH
        return 0;
    }

    if (
        (fromDay === 0 && toDay === 0) ||
        (isBankHoliday(fromObj) && isBankHoliday(toObj)) ||
        (fromDay === 0 && isBankHoliday(toObj)) ||
        (isBankHoliday(fromObj) && toDay === 0)
    ) {
        // all Sunday or BH
        return toTime - fromTime;
    }

    const to0000 = toObj.setHours(0, 0, 0, 0);

    if (fromDay === 6 || (!isBankHoliday(fromObj) && isBankHoliday(toObj))) {
        // Saturday into Sunday or non-BH into BH
        return toTime - to0000;
    }
    if (fromDay === 0 || (isBankHoliday(fromObj) && !isBankHoliday(toObj))) {
        // Sunday into Monday or BH into non-BH
        return to0000 - fromTime;
    }

    return 0;
};

const calculateAverageUshForRelief = (
    from: Date,
    plannedTo: Date,
    weeks: number,
    weeklyHoursMs: number,
    log: Section2LogEntry[]
) => {
    const averagePeriodStart = formatDate(
        addDaysToTimestamp(from, weeks * -7),
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
    const shiftLength =
        new Date(plannedTo).getTime() - new Date(from).getTime();

    return {
        plannedLowerRaw: Math.round(
            (totalUsh.lower / (weeklyHoursMs * weeks)) * shiftLength
        ),
        plannedHigherRaw: Math.round(
            (totalUsh.higher / (weeklyHoursMs * weeks)) * shiftLength
        ),
    };
};

const ushTypes: ShiftTypes[] = ["Normal", "OT", "AL", "Absent (TOIL)", "Bank"];

export const calculateUsh = (
    from: Date,
    plannedTo: Date,
    type: ShiftTypes = "Normal",
    hoursOverThresholdMs = 0,
    weeklyHoursMs = 1.35e8, //37.5hrs
    breakOverrideMs: number | null = null,
    log: Section2LogEntry[] = [],
    halfIsAllUsh: boolean = false,
    breakInHigherRate: boolean = true,
    overrunType: Overruns = "OT",
    actualTo: Date | null = null,
    reliefLeaveType: LeaveReliefUsh = "best"
): USH => {
    let plannedLowerRaw = 0;
    let plannedHigherRaw = 0;
    let overrunLower = 0;
    let overrunHigher = 0;
    if (from && plannedTo && ushTypes.includes(type)) {
        const fromObj = new Date(from);
        const plannedToObj = new Date(plannedTo);
        const actualToObj = actualTo ? new Date(actualTo) : null;

        plannedLowerRaw = calculateRawLowerRate(fromObj, plannedToObj);
        plannedHigherRaw = calculateRawHigherRate(fromObj, plannedToObj);

        const paidOverrunLength =
            actualToObj && overrunType === "OT"
                ? actualToObj.getTime() - plannedToObj.getTime()
                : 0;

        if (paidOverrunLength && actualToObj && overrunType === "OT") {
            overrunLower = calculateRawLowerRate(plannedToObj, actualToObj);
            overrunHigher = calculateRawHigherRate(plannedToObj, actualToObj);
        }

        let plannedLength = plannedToObj.getTime() - fromObj.getTime();

        const remainingBreak =
            breakOverrideMs === null || breakOverrideMs === undefined
                ? plannedLength > 21600000
                    ? 1800000
                    : 0
                : breakOverrideMs;

        if (hoursOverThresholdMs) {
            //recalculate USH based on new end
            //TODO here - need to account for OT overrun somehow --> DONE??
            plannedToObj.setTime(
                Math.min(
                    plannedToObj.getTime(),
                    Math.max(
                        fromObj.getTime(),
                        plannedToObj.getTime() +
                            paidOverrunLength -
                            remainingBreak -
                            hoursOverThresholdMs
                    )
                )
            );
            plannedLowerRaw = calculateRawLowerRate(fromObj, plannedToObj);
            plannedHigherRaw = calculateRawHigherRate(fromObj, plannedToObj);

            if ((overrunLower || overrunHigher) && actualToObj) {
                const originalPlannedTo = new Date(plannedTo);
                actualToObj.setTime(
                    Math.max(
                        actualToObj.getTime() - hoursOverThresholdMs,
                        originalPlannedTo.getTime()
                    )
                );
                overrunLower = calculateRawLowerRate(
                    originalPlannedTo,
                    actualToObj
                );
                overrunHigher = calculateRawHigherRate(
                    originalPlannedTo,
                    actualToObj
                );
            }
        }

        const totalPlannedUshRaw = plannedLowerRaw + plannedHigherRaw;

        if (
            totalPlannedUshRaw > plannedLength / 2 ||
            (halfIsAllUsh && totalPlannedUshRaw >= plannedLength / 2)
        ) {
            // more than half the shift is USH
            if (!plannedHigherRaw) {
                // only lower rate
                plannedLowerRaw = Math.max(
                    0,
                    plannedLength -
                        remainingBreak -
                        Math.max(hoursOverThresholdMs - paidOverrunLength, 0)
                );
            } else if (!plannedLowerRaw) {
                // only higher rate
                plannedHigherRaw = Math.max(
                    0,
                    plannedLength -
                        remainingBreak -
                        Math.max(hoursOverThresholdMs - paidOverrunLength, 0)
                );
            } else {
                if (hoursOverThresholdMs) {
                    // update shift length to match USH length with OT hours deducted
                    plannedLength = plannedToObj.getTime() - fromObj.getTime();
                }
                if (breakInHigherRate) {
                    // take break from more expensive side
                    const segmentBreak = Math.min(
                        plannedHigherRaw,
                        remainingBreak
                    );

                    //higher rate can never be increased beyond its raw value
                    plannedHigherRaw = Math.min(
                        plannedHigherRaw - segmentBreak,
                        plannedLength - plannedLowerRaw - segmentBreak
                    );

                    plannedLowerRaw =
                        plannedLength - plannedHigherRaw - remainingBreak;
                } else {
                    // take break from less expensive side
                    const segmentBreak = Math.min(
                        plannedLowerRaw,
                        remainingBreak
                    );
                    plannedLowerRaw =
                        plannedLength - plannedHigherRaw - segmentBreak;
                    plannedHigherRaw -= remainingBreak - segmentBreak;
                }
            }
        }
    } else if (type === "AL (relief)" || type === "Absent (TOIL relief)") {
        switch (reliefLeaveType) {
            case "best":
                {
                    const {
                        plannedLowerRaw: lower13,
                        plannedHigherRaw: higher13,
                    } = calculateAverageUshForRelief(
                        from,
                        plannedTo,
                        13,
                        weeklyHoursMs,
                        log
                    );
                    const {
                        plannedLowerRaw: lower52,
                        plannedHigherRaw: higher52,
                    } = calculateAverageUshForRelief(
                        from,
                        plannedTo,
                        13,
                        weeklyHoursMs,
                        log
                    );
                    //TODO weight for higher?
                    if (lower13 + higher13 > lower52 + higher52) {
                        plannedLowerRaw = lower13;
                        plannedHigherRaw = higher13;
                    } else {
                        plannedLowerRaw = lower52;
                        plannedHigherRaw = higher52;
                    }
                }
                break;
            case "average13":
                {
                    ({ plannedLowerRaw, plannedHigherRaw } =
                        calculateAverageUshForRelief(
                            from,
                            plannedTo,
                            13,
                            weeklyHoursMs,
                            log
                        ));
                }
                break;
            case "average52":
                {
                    ({ plannedLowerRaw, plannedHigherRaw } =
                        calculateAverageUshForRelief(
                            from,
                            plannedTo,
                            52,
                            weeklyHoursMs,
                            log
                        ));
                }
                break;
            case "flat":
                {
                    plannedLowerRaw = 7200000; // 2hrs;
                }
                break;
        }
    }

    return {
        lower_rate: Math.max(0, plannedLowerRaw + overrunLower),
        higher_rate: Math.max(0, plannedHigherRaw + overrunHigher),
    };
};
