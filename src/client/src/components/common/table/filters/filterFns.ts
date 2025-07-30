import { Row } from "@tanstack/react-table";

export const filterTimeOrDateRange = <T>(
    row: Row<T>,
    columnId: string,
    filterValue: [string | undefined, string | undefined]
) => {
    const [min, max]: [string | undefined, string | undefined] = filterValue;
    if (!min && !max) {
        return true;
    }
    const rowValue = row.getValue<string>(columnId);
    return (!min || rowValue >= min) && (!max || rowValue <= max);
};
