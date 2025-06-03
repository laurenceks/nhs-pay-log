import { roundTo } from "round-to";

export const msToDecimalHours = (timeInMs: number) => timeInMs / 3600000;
export const msToTableFormat = (timeInMs: number) =>
    roundTo(msToDecimalHours(timeInMs), 3);
export const decimalHoursToMs = (timeInHrs: number) =>
    roundTo(timeInHrs * 3600000, 0);

export const makeToAlwaysLater = (from: Date | string, to: Date | string) => {
    const fromObj = new Date(from);
    const toObj = new Date(to);
    const fromTime = fromObj.getTime();
    const toTime = toObj.getTime();

    if (fromTime > toTime) {
        toObj.setDate(toObj.getDate() + 1);
    }
    return { fromObj, toObj };
};

export const convertToDate = (val: Date | string) =>
    typeof val === "string" ? new Date(val) : val;
export const convertToNumber = (val: Date | string | number) =>
    typeof val === "number" ? val : convertToDate(val).getTime();
