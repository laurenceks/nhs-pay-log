import { Contract, ShiftExtra } from "../../../types/commonTypes";
import { formatDate } from "./formatDates";
import { LookupTable, PayBand, PayBandTable } from "../../../types/lookupTypes";
import { queryClient } from "../../client/src/App";
import { ApiResponse } from "../../../types/responseTypes";

const withinDateRange = <T>(d: string | Date, x: LookupTable<T>[0]) => {
    const dSorting = formatDate(d, "yyyy-mm-dd");
    return (
        (x.to && x.from && x.to >= dSorting && x.from <= dSorting) ||
        (!x.from && x.to && x.to >= dSorting) ||
        (!x.to && x.from && x.from <= dSorting)
    );
};
const withinDateRangeAndMatchingKey = <T>(
    d: string | Date,
    x: LookupTable<T>[0],
    matchKey?: keyof LookupTable<T>[0],
    matchValue?: string | number | null
) => {
    return (
        withinDateRange(d, x) &&
        (!matchKey || !matchValue || x[matchKey] === matchValue)
    );
};
export const lookupByDate = <T>({
    arr = [],
    d = new Date(),
    returnKey,
    matchKey,
    matchValue,
}: {
    arr: LookupTable<T>;
    d: string | Date;
    matchKey?: keyof LookupTable<T>[0];
    returnKey?: keyof T;
    matchValue: string | number | null;
}) => {
    const result = arr.find((x) =>
        withinDateRangeAndMatchingKey(d, x, matchKey, matchValue)
    );

    if (result && returnKey && returnKey in result) {
        return result[returnKey];
    }
    return result;
};
export const lookupPayByContract = ({
    d = new Date(),
    contractId,
    payIdOverride,
    contracts,
}: {
    d: string | Date;
    contractId: number;
    payIdOverride?: string | null;
    contracts: Contract[];
}): PayBand | undefined => {
    const payGroupId =
        payIdOverride ||
        (lookupByDate<Contract>({
            arr: contracts,
            d,
            returnKey: "pay_group_id",
            matchKey: "id",
            matchValue: contractId,
        }) as keyof PayBand);

    if (payGroupId) {
        return (
            queryClient.getQueryData(["payBands"]) as ApiResponse<PayBandTable>
        ).data?.find((x) => {
            return withinDateRange<PayBand>(d, x) && payGroupId === x.group_id;
        });
    }

    return undefined;
};
export const lookupShiftExtra = (
    d: string | Date,
    id: ShiftExtra["group_id"]
): number => {
    const foundValue = (
        queryClient.getQueryData(["extras"]) as ApiResponse<ShiftExtra[]>
    ).data?.find((x) => {
        //TODO validate string dates
        return x.group_id === id && withinDateRange(d, x);
    })?.value;
    return foundValue && typeof foundValue === "string"
        ? parseInt(foundValue, 10)
        : 0;
};

export const filterOptionsByDate = <T>(
    arr: LookupTable<T> = [],
    d: string | Date = new Date(),
    matchKey?: keyof LookupTable<T>[0],
    matchValue?: string | number | null
) => {
    return arr.filter((x) =>
        withinDateRangeAndMatchingKey(d, x, matchKey, matchValue)
    );
};
