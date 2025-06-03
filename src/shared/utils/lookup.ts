import { ShiftExtra } from "../../../types/commonTypes";
import { formatDate } from "./formatDates.ts";

export const lookupByDate = <T>({
    arr = [],
    d = new Date(),
    returnKey,
    employment_id,
}: {
    arr: ({
        from?: string | Date | number;
        to?: string | Date | number;
        employment_id: string;
    } & T)[];
    d: string | Date;
    employment_id: string;
    returnKey?: keyof T;
}) => {
    const dSorting = formatDate(d, "yyyy-mm-dd");
    const result = arr.find((x) => {
        return (
            ((!x.from && x.to && x.to >= dSorting) ||
                (!x.to && x.from && x.from <= dSorting) ||
                (x.to && x.from && x.to >= dSorting && x.from <= dSorting)) &&
            (!employment_id || x.employment_id === employment_id)
        );
    });
    if (result && returnKey && returnKey in result) {
        return result[returnKey];
    }
    return result;
};
export const lookupShiftExtra = (
    arr: ShiftExtra[],
    d: string | Date | number,
    id: ShiftExtra["id"]
) => {
    return (
        arr.find((x) => {
            //TODO validate string dates
            return (
                x.id === id &&
                ((!x.from && x.to && x.to >= d) ||
                    (!x.to && x.from && x.from <= d) ||
                    (x.to && x.from && x.to >= d && x.from <= d) ||
                    (!x.from && !x.to))
            );
        })?.amount || 0
    );
};

export const filterOptionsByDate = <T>(
    arr: ({
        from?: string | Date | number;
        to?: string | Date | number;
        employment_id?: string;
    } & T)[] = [],
    d: string | Date = new Date(),
    employment_id?: string
) => {
    const dSorting = formatDate(d, "yyyy-mm-dd");
    return arr.filter(
        (x) =>
            ((!x.from && x.to && x.to >= dSorting) ||
                (!x.to && x.from && x.from <= dSorting) ||
                (x.to && x.from && x.to >= dSorting && x.from <= dSorting)) &&
            (!employment_id || x.employment_id === employment_id)
    );
};
