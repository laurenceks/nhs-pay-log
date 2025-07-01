import { ShiftExtra } from "../../../types/commonTypes";
import { filterOptionsByDate } from "./lookup";

export const updateShiftExtras = (
    currentExtrasGroupIds: string | null,
    extras: ShiftExtra[] = [],
    searchDate: string | Date = new Date()
): {
    updatedExtras: ShiftExtra[];
    updatedExtrasGroupIds: string;
    filteredExtras: ShiftExtra[];
} => {
    const filteredExtrasByDate = filterOptionsByDate<ShiftExtra>(
        extras,
        searchDate
    );

    const updatedExtras: ShiftExtra[] = [];
    const updatedExtrasGroupIds: number[] = [];

    filteredExtrasByDate?.forEach((x) => {
        if (currentExtrasGroupIds?.includes(x.group_id.toString())) {
            updatedExtras.push(x);
            updatedExtrasGroupIds.push(x.group_id);
        }
    });

    return {
        updatedExtras,
        updatedExtrasGroupIds: updatedExtrasGroupIds.join(","),
        filteredExtras: filteredExtrasByDate,
    };
};
