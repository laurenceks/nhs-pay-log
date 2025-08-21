import { Outlet, useLoaderData } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    filterInArray,
    filterTimeOrDateRange,
} from "../common/table/filters/filterFns";
import TanStackTable from "../common/table/TanStackTable";
import FilterButton from "../common/table/filters/FilterButton";
import AggregationButton from "../common/table/aggregation/AggregationButton";
import { Aggregations } from "../../../../../types/commonTypes";
import { hoursTableColumnsDef } from "../common/table/columnDefs/hoursTableColumnDefs";

const Hours = () => {
    const { hours } = useLoaderData({
        from: "/_private/_nav/_table/hours/$employmentId",
    });
    const columns = useMemo(() => hoursTableColumnsDef, []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [aggregation, setAggregation] = useState<Aggregations | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const table = useReactTable({
        data: hours,
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
        <div className="position-relative">
            <TanStackTable
                table={table}
                showFilters={showFilters}
                aggregation={aggregation}
            />
            <Outlet />
            <div className="position-fixed bottom-0 start-0 ms-4 mb-3 d-flex gap-3">
                <FilterButton
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    activeFiltersCount={columnFilters.length}
                />
                <AggregationButton
                    aggregation={aggregation}
                    setAggregation={setAggregation}
                />
            </div>
        </div>
    );
};

export default Hours;
