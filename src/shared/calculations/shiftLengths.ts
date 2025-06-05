import { convertToDate, convertToNumber } from "../utils/conversions";
import bankHolidays from "../../../tests/data/bankHolidays";

export const calculateShiftLength = (
    from: Date | string | number,
    to: Date | string | number
) => {
    return convertToNumber(to) - convertToNumber(from);
};
export const calculateShiftHours = (
    from: Date | string | number,
    to: Date | string | number
) => {
    const shiftLength = calculateShiftLength(from, to);
    return shiftLength > 21600000 ? shiftLength - 1800000 : shiftLength;
};

export const isBankHoliday = (date: Date | string) => {
    const lookupDate = convertToDate(date).toISOString().slice(0, 10);
    return bankHolidays["england-and-wales"].events.some(
        (bh) => bh.date === lookupDate
    );
};
