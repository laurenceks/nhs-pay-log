import { Aggregations, ParsedApiShift } from "../../../../../types/commonTypes";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { logTableColumnsDef } from "../common/table/columnDefs/logTableColumnsDef";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import TanStackTable from "../common/table/TanStackTable";
import { useNavigate } from "@tanstack/react-router";
import {
    filterInArray,
    filterTimeOrDateRange,
} from "../common/table/filters/filterFns";

const LogTable = ({
    log,
    showFilters,
    columnFilters,
    setColumnFilters,
    aggregation,
}: {
    log: ParsedApiShift[];
    showFilters: boolean;
    columnFilters: ColumnFiltersState;
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
    aggregation: Aggregations | null;
}) => {
    const navigate = useNavigate();
    const columns = useMemo(() => logTableColumnsDef, []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data: log,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        maxMultiSortColCount: 3,
        filterFns: {
            inDateRange: filterTimeOrDateRange,
            inTimeRange: filterTimeOrDateRange,
            inArray: filterInArray,
        },
    });

    return (
        <TanStackTable
            table={table}
            showFilters={showFilters}
            aggregation={aggregation}
            rowClick={(row: Row<ParsedApiShift>) =>
                navigate({
                    to: "/log/$shiftId",
                    params: {
                        shiftId: row.original.id.toString(),
                    },
                })
            }
        />
    );
};

export default LogTable;
