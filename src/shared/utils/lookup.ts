import { ShiftExtra } from "../../../types/commonTypes";

export const lookupByDate = <T>(
    arr: ({ from?: string | Date | number; to?: string | Date | number } & T)[],
    d: string | Date | number,
    returnKey?: keyof T
) => {
    const result = arr.find((x) => {
        //TODO validate string dates
        return (
            (!x.from && x.to && x.to >= d) ||
            (!x.to && x.from && x.from <= d) ||
            (x.to && x.from && x.to >= d && x.from <= d)
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
