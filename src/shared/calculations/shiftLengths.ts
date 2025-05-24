import {
    convertToDate,
    convertToNumber,
    msToDecimalHours,
} from "../utils/conversions.ts";
import bankHolidays from "../../../tests/data/bankHolidays.ts";

export const calculateShiftLength = (
    from: Date | string | number,
    to: Date | string | number
) => {
    return msToDecimalHours(convertToNumber(to) - convertToNumber(from));
};
export const calculateShiftHours = (
    from: Date | string | number,
    to: Date | string | number
) => {
    const shiftLength = calculateShiftLength(from, to);
    return shiftLength > 6 ? shiftLength - 0.5 : shiftLength;
};

export const isBankHoliday = (date: Date | string) => {
    const lookupDate = convertToDate(date).toISOString().slice(0, 10);
    return bankHolidays["england-and-wales"].events.some(
        (bh) => bh.date === lookupDate
    );
};
