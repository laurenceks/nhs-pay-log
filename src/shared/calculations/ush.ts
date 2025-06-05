import { makeToAlwaysLater } from "../utils/conversions";
import { isBankHoliday } from "./shiftLengths";
import { ShiftTypes } from "../../../types/commonTypes";

export const calculateRawLowerRate = (from: Date, to: Date) => {
    // returns in ms the total time within the lower rate windows
    if (!from || !to) {
        return 0;
    }
    const fromTime = from.getTime();
    const toObj = makeToAlwaysLater(from, to).toObj;
    const toTime = toObj.getTime();
    const fromDay = from.getDay();
    const toDay = toObj.getDay();

    if (
        (fromDay === 0 && toDay === 0) ||
        (isBankHoliday(from) && isBankHoliday(to))
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
        return to.setHours(0, 0, 0, 0) - fromTime;
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
            lowerRateHours += Math.min(from0600, toTime) - fromTime;
        }

        const from2400 = from.setHours(24, 0, 0, 0);

        if ((fromTime < from2000 && toTime > from2000) || fromTime > from2000) {
            lowerRateHours +=
                Math.min(toTime, from2400) - Math.max(from2000, fromTime);
        }

        if (toTime > from2400) {
            lowerRateHours +=
                Math.min(toTime, toObj.setHours(6, 0, 0, 0)) - from2400;
        }

        const to2000 = toObj.setHours(20, 0, 0, 0);

        if (toTime > to2000 && to2000 > from2400) {
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
    const toObj = makeToAlwaysLater(from, to).toObj;
    const toTime = toObj.getTime();
    const fromDay = from.getDay();
    const toDay = toObj.getDay();

    if (
        fromDay !== 0 &&
        toDay !== 0 &&
        !isBankHoliday(from) &&
        !isBankHoliday(toObj)
    ) {
        // neither Sunday nor BH
        return 0;
    }

    if (
        (fromDay === 0 && toDay === 0) ||
        (isBankHoliday(from) && isBankHoliday(toObj))
    ) {
        // all Sunday or BH
        return toTime - fromTime;
    }

    const to0000 = toObj.setHours(0, 0, 0, 0);
    if (fromDay === 6 || (!isBankHoliday(from) && isBankHoliday(toObj))) {
        // Saturday into Sunday or non-BH into BH
        return toTime - to0000;
    }
    if (fromDay === 0 || (isBankHoliday(from) && !isBankHoliday(toObj))) {
        // Sunday into Monday or BH into non-BH
        return to0000 - fromTime;
    }

    return 0;
};

const ushTypes: ShiftTypes[] = ["Normal", "OT", "AL", "Absent (TOIL)", "Bank"];

export const calculateUsh = (
    from: Date | string,
    to: Date | string,
    type: ShiftTypes = "Normal",
    hoursOverThreshold = 0
) => {
    let lowerRateRaw = 0;
    let higherRateRaw = 0;
    if (from && to && ushTypes.includes(type)) {
        //TODO is making sure timestamps are always later still necessary now that they are set using the reducer which makes sure already?
        const { fromObj, toObj } = makeToAlwaysLater(from, to);
        const hoursOverThresholdMs = hoursOverThreshold * 60 * 60 * 1000;

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

        const remainingBreak = shiftLength > 21600000 ? 1800000 : 0;

        if (hoursOverThreshold) {
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

        if (totalUshRaw >= shiftLength / 2) {
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
                if (hoursOverThreshold) {
                    // update shift length to match USH length with OT hours deducted
                    shiftLength = toObj.getTime() - fromObj.getTime();
                }
                const segmentBreak = Math.min(lowerRateRaw, remainingBreak);
                // take break from cheaper side
                lowerRateRaw = shiftLength - higherRateRaw - segmentBreak;
                higherRateRaw -= remainingBreak - segmentBreak;
            }
        }
    }

    return {
        lower_rate: Math.max(0, lowerRateRaw),
        higher_rate: Math.max(0, higherRateRaw),
    };
    //}
};
