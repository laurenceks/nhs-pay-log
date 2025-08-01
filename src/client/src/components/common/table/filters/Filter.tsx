import { Column } from "@tanstack/react-table";
import FilterRange from "./FilterRange";
import FilterArray from "./FilterArray";
import FilterString from "./FilterString";

const typeMap = {
    inNumberRange: "number",
    inDateRange: "date",
    inTimeRange: "time",
} as const;

const Filter = <T,>({ column }: { column: Column<T> }) => {
    if (!column.getCanFilter()) return null;

    const filterType =
        (column.columnDef.filterFn as string) ?? "includesString";

    if (filterType in typeMap) {
        return (
            <FilterRange
                column={column}
                type={typeMap[filterType as keyof typeof typeMap]}
            />
        );
    }

    if (filterType === "inArray") {
        return <FilterArray column={column} />;
    }

    return <FilterString column={column} />;
};
export default Filter;
