import { decimalHoursToMs, makeToAlwaysLater } from "../utils/conversions";
import {
    calculateShiftHours,
    calculateShiftLength,
    isBankHoliday,
} from "./shiftLengths";
import {
    AdditionalHours,
    LogShift,
    ShiftTypes,
} from "../../../types/commonTypes";
import { lookupByDate } from "../utils/lookup";
import mockEmploymentLookup from "../../../tests/data/mockEmploymentLookup";

const additionalHoursShiftTypes = ["OT", "TOIL", "Bank"];

export const calculateCumulativeAdditionalHours = (
    from: Date,
    id: string,
    log: LogShift[] = [],
    employment: string
) => {
    const prevMonday = new Date(from);
    prevMonday.setHours(0, 0, 0, 0);
    prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

    return log.reduce((acc, val) => {
        const valFrom = new Date(`${val.date} ${val.start}`);
        const valTo = makeToAlwaysLater(
            valFrom,
            `${val.date} ${val.actual_end}`
        ).toObj;
        if (
            valFrom >= prevMonday &&
            valFrom < from &&
            id !== val.id &&
            employment === val.employment_id
        ) {
            if (additionalHoursShiftTypes.includes(val.type)) {
                return acc + calculateShiftHours(valFrom, valTo);
            } else {
                return (
                    acc +
                    calculateShiftHours(
                        makeToAlwaysLater(
                            valFrom,
                            `${val.date} ${val.planned_end}`
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
        actual_to,
        planned_to,
        overrun_type,
        type,
        id,
        employment_id,
    }: {
        from: string;
        actual_to: string;
        employment_id: string;
        planned_to: string;
        overrun_type: string;
        type: ShiftTypes;
        id: string;
    },
    log: LogShift[]
) => {
    const additionalHoursBreakdown: AdditionalHours = {
        flat: 0,
        time_and_half: 0,
        double: 0,
        toil: 0,
    };
    if (type && from && actual_to && planned_to) {
        additionalHoursBreakdown.toil = calculateBankHolidayToil(
            type,
            from,
            planned_to
        );
        const isAdditionalHoursShift = additionalHoursShiftTypes.includes(type);
        const { fromObj, toObj } = makeToAlwaysLater(
            isAdditionalHoursShift ? from : planned_to,
            overrun_type === "OT" ? actual_to : planned_to
        );

        const fromIsBankHoliday = isBankHoliday(fromObj);
        const toIsBankHoliday = isBankHoliday(toObj);

        const cumulativeAdditionalHours =
            type === "Bank"
                ? 0
                : calculateCumulativeAdditionalHours(
                      fromObj,
                      id,
                      log,
                      employment_id
                  );
        const paidAdditionalHours = isAdditionalHoursShift
            ? calculateShiftHours(fromObj, toObj)
            : calculateShiftLength(fromObj, toObj);

        const { fromObj: overrunFrom, toObj: overrunTo } = makeToAlwaysLater(
            planned_to,
            actual_to
        );

        const overrunHours =
            overrunFrom === overrunTo
                ? 0
                : calculateShiftLength(planned_to, overrunTo);

        if (paidAdditionalHours || overrunHours) {
            const weeklyOtThresholdHours =
                1.35e8 - //37.5hrs
                decimalHoursToMs(
                    (lookupByDate({
                        arr: mockEmploymentLookup,
                        d: fromObj,
                        returnKey: "weekly_hours",
                        employment_id: employment_id,
                    }) as number) ?? 1.35e8 //37.5hrs
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
                    paidAdditionalHours +
                        overrunHours +
                        cumulativeAdditionalHours >=
                    weeklyOtThresholdHours
                ) {
                    //TODO test night shifts
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
                                    fromObj.setHours(24, 0, 0, 0)
                                );
                        } else {
                            //midnight until to time
                            additionalHoursBreakdown.double =
                                calculateShiftLength(
                                    fromObj.setHours(24, 0, 0, 0),
                                    toObj
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
                additionalHoursBreakdown.flat =
                    paidAdditionalHours * 1.12004801920768;
            }

            if (type === "TOIL" || overrun_type === "TOIL") {
                if (type === "TOIL") {
                    additionalHoursBreakdown.toil += paidAdditionalHours;
                }
                if (overrun_type === "TOIL") {
                    additionalHoursBreakdown.toil += overrunHours;
                }
            }
        }
    }

    return additionalHoursBreakdown;
};
