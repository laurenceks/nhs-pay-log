import { makeToAlwaysLater } from "./conversions.ts";
import {
    calculateShiftHours,
    calculateShiftLength,
    isBankHoliday,
} from "./shiftLengths.ts";
import { LogShift, ShiftTypes } from "../../types/commonTypes";

const additionalHoursShiftTypes = ["OT", "TOIL", "Bank"];

export const calculateCumulativeAdditionalHours = (
    from: Date,
    id: string,
    log: LogShift[] = []
) => {
    const prevMonday = new Date(from);
    prevMonday.setHours(0, 0, 0, 0);
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

    return log.reduce((acc, val) => {
        const valFrom = new Date(`${val.date} ${val.start}`);
        const valTo = makeToAlwaysLater(
            valFrom,
            `${val.date} ${val.actualEnd}`
        ).toObj;
        if (valFrom >= prevMonday && valFrom < from && id !== val.id) {
            if (additionalHoursShiftTypes.includes(val.type)) {
                return acc + calculateShiftHours(valFrom, valTo);
            } else {
                return (
                    acc +
                    calculateShiftHours(
                        makeToAlwaysLater(
                            valFrom,
                            `${val.date} ${val.plannedEnd}`
                        ).toObj,
                        valTo
                    )
                );
            }
        }
        return acc;
    }, 0);
};

const calculateBankHolidayToil = (
    type: ShiftTypes,
    from: string,
    plannedTo: string
) => {
    const { fromObj, toObj } = makeToAlwaysLater(from, plannedTo);
    const fromIsBankHoliday = isBankHoliday(fromObj);
    const toIsBankHoliday = isBankHoliday(toObj);
    if (type === "Normal" && (fromIsBankHoliday || toIsBankHoliday)) {
        if (fromIsBankHoliday && toIsBankHoliday) {
            return calculateShiftHours(fromObj, toObj);
        } else if (fromIsBankHoliday) {
            return calculateShiftLength(fromObj, fromObj.setHours(24, 0, 0, 0));
        } else {
            //midnight until to time
            return calculateShiftLength(fromObj.setHours(24, 0, 0, 0), toObj);
        }
    }
    return 0;
};

export const calculateAdditionalHours = (
    {
        from,
        actualTo,
        plannedTo,
        overrunType,
        type,
        id,
    }: {
        from: string;
        actualTo: string;
        plannedTo: string;
        overrunType: string;
        type: ShiftTypes;
        id: string;
    },
    log: LogShift[]
) => {
    const additionalHoursBreakdown = {
        flat: 0,
        timeAndHalf: 0,
        double: 0,
        toil: 0,
    };
    if (type && from && actualTo && plannedTo) {
        additionalHoursBreakdown.toil = calculateBankHolidayToil(
            type,
            from,
            plannedTo
        );
        const isAdditionalHoursShift = additionalHoursShiftTypes.includes(type);
        const { fromObj, toObj } = makeToAlwaysLater(
            isAdditionalHoursShift ? from : plannedTo,
            overrunType === "OT" ? actualTo : plannedTo
        );

        const fromIsBankHoliday = isBankHoliday(fromObj);
        const toIsBankHoliday = isBankHoliday(toObj);

        const cumulativeAdditionalHours =
            type === "Bank"
                ? 0
                : calculateCumulativeAdditionalHours(fromObj, id, log);
        const paidAdditionalHours = isAdditionalHoursShift
            ? calculateShiftHours(fromObj, toObj)
            : calculateShiftLength(fromObj, toObj);

        const { fromObj: overrunFrom, toObj: overrunTo } = makeToAlwaysLater(
            plannedTo,
            actualTo
        );

        const overrunHours =
            overrunFrom === overrunTo
                ? 0
                : calculateShiftLength(plannedTo, overrunTo);

        if (paidAdditionalHours || overrunHours) {
            // TODO make this a lookup (37.5 - weekly contracted hours)
            const weeklyOtThresholdHours = 18.75;

            if (
                paidAdditionalHours +
                    overrunHours +
                    cumulativeAdditionalHours >=
                    weeklyOtThresholdHours &&
                type !== "Bank"
            ) {
                additionalHoursBreakdown.flat = Math.max(
                    0,
                    Math.min(
                        paidAdditionalHours,
                        weeklyOtThresholdHours - cumulativeAdditionalHours
                    )
                );

                //TODO test night shifts
                if (fromIsBankHoliday || toIsBankHoliday) {
                    if (fromIsBankHoliday && toIsBankHoliday) {
                        additionalHoursBreakdown.double = Math.max(
                            0,
                            paidAdditionalHours - additionalHoursBreakdown.flat
                        );
                    } else if (fromIsBankHoliday) {
                        //from time until midnight
                        additionalHoursBreakdown.double = calculateShiftLength(
                            fromObj,
                            fromObj.setHours(24, 0, 0, 0)
                        );
                    } else {
                        //midnight until to time
                        additionalHoursBreakdown.double = calculateShiftLength(
                            fromObj.setHours(24, 0, 0, 0),
                            toObj
                        );
                    }
                }

                additionalHoursBreakdown.timeAndHalf = Math.max(
                    0,
                    paidAdditionalHours -
                        additionalHoursBreakdown.double -
                        additionalHoursBreakdown.flat
                );
            } else {
                additionalHoursBreakdown.flat =
                    paidAdditionalHours *
                    (type === "Bank" ? 1.12004801920768 : 1);
            }

            if (type === "TOIL" || overrunType === "TOIL") {
                if (type === "TOIL") {
                    additionalHoursBreakdown.toil += paidAdditionalHours;
                }
                if (overrunType === "TOIL") {
                    additionalHoursBreakdown.toil += overrunHours;
                }
            }
        }
    }

    return additionalHoursBreakdown;
};
