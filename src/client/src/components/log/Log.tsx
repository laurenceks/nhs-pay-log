import LogTable from "./LogTable";
import { Button } from "react-bootstrap";
import { Outlet, useLoaderData, useNavigate } from "@tanstack/react-router";
import { memo, useState } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
    addDaysToTimestamp,
    formatDate,
} from "../../../../shared/utils/formatDates";
import FilterButton from "../common/table/filters/FilterButton";
import { Aggregations } from "../../../../../types/commonTypes";
import AggregationButton from "../common/table/aggregation/AggregationButton";

const getDefaultDateFilter = () => {
    const today = new Date();
    today.setDate(1);
    const from = formatDate(addDaysToTimestamp(today, -14), "yyyy-mm-dd");
    today.setMonth(today.getMonth() + 2);
    return [from, formatDate(addDaysToTimestamp(today, -1), "yyyy-mm-dd")];
};

// eslint-disable-next-line react/display-name
const Log = memo(({ disabled }: { disabled: boolean }) => {
    const navigate = useNavigate();
    const { displayLog } = useLoaderData({ from: "/_private/_table/log" });
    const [showFilters, setShowFilters] = useState(false);
    const [aggregation, setAggregation] = useState<Aggregations | null>(null);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
        { id: "from", value: getDefaultDateFilter() },
    ]);

    return (
        <div className="position-relative">
            <LogTable
                log={displayLog}
                showFilters={showFilters}
                aggregation={aggregation}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
            />
            <Outlet />
            <div className="position-fixed bottom-0 start-0 m-3 d-flex gap-3">
                <Button
                    variant="secondary"
                    disabled={disabled}
                    onClick={() =>
                        navigate({
                            to: "/",
                        })
                    }
                >
                    Home
                </Button>
                <Button
                    variant="success"
                    disabled={disabled}
                    onClick={() =>
                        navigate({
                            to: "/log/$shiftId",
                            params: { shiftId: "new" },
                        })
                    }
                >
                    Add
                </Button>
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
});

export default Log;
