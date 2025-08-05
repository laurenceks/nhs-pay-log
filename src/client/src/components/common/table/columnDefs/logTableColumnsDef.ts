import { ColumnDef } from "@tanstack/react-table";
import { ParsedApiShift } from "../../../../../../../types/commonTypes";
import { convertToGbp } from "../../../../../../shared/utils/conversions";
import { roundTo } from "round-to";
import { formatDate } from "../../../../../../shared/utils/formatDates";

export const logTableColumnsDef: ColumnDef<ParsedApiShift>[] = [
    {
        header: "Date",
        accessorKey: "from",
        accessorFn: (row) => row.date,
        cell: (cell) => cell.row.original.from,
        filterFn: "inDateRange",
        id: "from",
        meta: {
            iconType: "numeric",
            aggregationTypes: ["min", "max"],
            aggregationDisplayFn: (val: string) => formatDate(val, "dd/mm/yy"),
        },
    },
    {
        header: "Start",
        accessorKey: "start",
        filterFn: "inTimeRange",
        meta: { iconType: "numeric" },
    },
    {
        header: "Planned end",
        accessorKey: "planned_end",
        filterFn: "inTimeRange",
        meta: { iconType: "numeric" },
    },
    {
        header: "Actual end",
        accessorKey: "actual_end",
        filterFn: "inTimeRange",
        meta: { iconType: "numeric" },
    },
    {
        header: "Employer",
        accessorKey: "employment_name",
        filterFn: "includesString",
        meta: { aggregationTypes: ["min", "max"] },
    },
    {
        header: "Type",
        accessorKey: "type",
        filterFn: "inArray",
    },
    {
        header: "Overrun type",
        accessorKey: "overrun_type",
        filterFn: "inArray",
    },
    {
        header: "TOIL",
        accessorKey: "toil",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "USH lower",
        accessorKey: "lower_rate",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "USH higher",
        accessorKey: "higher_rate",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Flat",
        accessorKey: "flat",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Time and a half",
        accessorKey: "time_and_half",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Double",
        accessorKey: "double",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Extra pay",
        accessorKey: "extra_pay",
        accessorFn: (row) => row.extra_pay,
        cell: (cell) => convertToGbp(cell.row.original.extra_pay),
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: convertToGbp,
        },
    },
];
