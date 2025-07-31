import { ParsedApiShift } from "../../../../../types/commonTypes";
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
import { useMemo, useState } from "react";
import TanStackTable from "../common/table/TanStackTable";
import { useNavigate } from "@tanstack/react-router";
import { filterTimeOrDateRange } from "../common/table/filters/filterFns";

const LogTable = ({
    log,
    showFilters,
}: {
    log: ParsedApiShift[];
    showFilters: boolean;
}) => {
    const navigate = useNavigate();
    const columns = useMemo(() => logTableColumnsDef, []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
        },
    });

    return (
        <TanStackTable
            table={table}
            showFilters={showFilters}
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
