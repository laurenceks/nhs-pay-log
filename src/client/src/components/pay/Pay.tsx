import { Outlet, useLoaderData, useNavigate } from "@tanstack/react-router";
import { Button } from "react-bootstrap";
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
import { payTableColumnsDef } from "../common/table/columnDefs/payTableColumnDefs";
import TanStackTable from "../common/table/TanStackTable";
import FilterButton from "../common/table/filters/FilterButton";

const Pay = () => {
    const navigate = useNavigate();
    const { pay } = useLoaderData({ from: "/_private/_table/pay" });
    const columns = useMemo(() => payTableColumnsDef, []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [showFilters, setShowFilters] = useState(false);
    const table = useReactTable({
        data: pay,
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
                rowClick={(row) => {
                    navigate({
                        to: "/pay/$employmentId/$payMonth",
                        params: {
                            employmentId: row.original.employment_id.toString(),
                            payMonth: row.original.pay_month,
                        },
                    });
                }}
            />
            <Outlet />
            <div className="position-fixed bottom-0 start-0 ms-4 mb-3 d-flex gap-3">
                <Button
                    variant="secondary"
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    Home
                </Button>
                <FilterButton
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    activeFiltersCount={columnFilters.length}
                />
            </div>
        </div>
    );
};

export default Pay;
