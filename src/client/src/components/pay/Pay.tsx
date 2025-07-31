import { useLoaderData, useNavigate } from "@tanstack/react-router";
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
import { filterTimeOrDateRange } from "../common/table/filters/filterFns";
import { payTableColumnsDef } from "../common/table/columnDefs/payTableColumnDefs";
import TanStackTable from "../common/table/TanStackTable";
import IconWrap from "../common/IconWrap";
import { IoFunnel } from "react-icons/io5";

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
        },
    });

    return (
        <div className="position-relative">
            <TanStackTable table={table} showFilters={showFilters} />
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
                <Button
                    variant="dark"
                    className="d-flex align-items-center justify-content-center px-2"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <IconWrap variant="light" width={"1.5rem"} as="span">
                        <IoFunnel />
                    </IconWrap>
                </Button>
            </div>
        </div>
    );
};

export default Pay;
