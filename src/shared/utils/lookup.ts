import { ShiftExtra } from "../../../types/commonTypes";
import { formatDate } from "./formatDates";
import mockPayTable from "../../../tests/data/mockPayTable";
import mockEmploymentTable from "../../../tests/data/mockEmploymentTable";
import {
    LookupTable,
    PayTableItemValue,
    PayTableStructured,
} from "../../../types/lookupTypes";

const withinDateRange = <T>(d: string | Date, x: LookupTable<T>[0]) => {
    const dSorting = formatDate(d, "yyyy-mm-dd");
    return (
        (!x.from && x.to && x.to >= dSorting) ||
        (!x.to && x.from && x.from <= dSorting) ||
        (x.to && x.from && x.to >= dSorting && x.from <= dSorting)
    );
};
const withinDateRangeAndSameEmployment = <T>(
    d: string | Date,
    x: LookupTable<T>[0],
    employment_id?: string
) => {
    return (
        withinDateRange(d, x) &&
        (!employment_id || x.employment_id === employment_id)
    );
};

export const lookupByDate = <T>({
    arr = [],
    d = new Date(),
    returnKey,
    employment_id,
}: {
    arr: LookupTable<T>;
    d: string | Date;
    employment_id?: string;
    returnKey?: keyof T;
}) => {
    const result = arr.find((x) => {
        return (
            withinDateRangeAndSameEmployment(d, x, employment_id) &&
            (!employment_id || x.employment_id === employment_id)
        );
    });
    if (result && returnKey && returnKey in result) {
        return result[returnKey];
    }
    return result;
};
export const lookupPayByEmployment = ({
    d = new Date(),
    returnKey,
    employment_id,
}: {
    d: string | Date;
    employment_id: string;
    returnKey?: keyof PayTableItemValue;
}) => {
    const band = lookupByDate<(typeof mockEmploymentTable)[0]>({
        arr: mockEmploymentTable,
        d,
        employment_id,
        returnKey: "pay_id",
    }) as keyof PayTableStructured;

    if (band && band in mockPayTable) {
        const result: PayTableItemValue | undefined = lookupByDate({
            arr: mockPayTable[band].values,
            d,
        }) as PayTableItemValue | undefined;
        if (result) {
            if (returnKey && returnKey in result) {
                return result[returnKey];
            } else {
                return result;
            }
        }
    }
    return undefined;
};
export const lookupShiftExtra = (
    arr: ShiftExtra[],
    d: string | Date,
    id: ShiftExtra["id"]
) => {
    return (
        arr.find((x) => {
            //TODO validate string dates
            return x.id === id && withinDateRange(d, x);
        })?.value || 0
    );
};

export const filterOptionsByDate = <T>(
    arr: LookupTable<T> = [],
    d: string | Date = new Date(),
    employment_id?: string
) => {
    return arr.filter((x) =>
        withinDateRangeAndSameEmployment(d, x, employment_id)
    );
};
