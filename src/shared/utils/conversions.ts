import { roundTo } from "round-to";

export const msToDecimalHours = (timeInMs: number) => timeInMs / 3600000;

export const msToTableFormat = (timeInMs: number) =>
    roundTo(msToDecimalHours(timeInMs), 3);

export const msToFormattedHours = (timeInMs: number) => {
    const sign = timeInMs < 0 ? "-" : "";
    const totalMinutes = Math.floor(Math.abs(timeInMs) / 60000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
export const decimalHoursToMs = (timeInHrs: number) =>
    roundTo(timeInHrs * 3600000, 0);

export const makeToAlwaysLater = (
    from: Date | string | number,
    to: Date | string | number
) => {
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

export const convertToGbp = (val: number) =>
    new Intl.NumberFormat("en-GB", {
        currency: "GBP",
        style: "currency",
    }).format(val);

export const convertToPayslipFigure = (
    val: string | number,
    precision = 2
): string => {
    if (isNaN(Number(val))) {
        return val as string;
    } else {
        const n = Number(val);
        return n ? roundTo(n, precision).toFixed(precision) : "";
    }
};
