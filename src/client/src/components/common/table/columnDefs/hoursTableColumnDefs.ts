import { ColumnDef } from "@tanstack/react-table";
import {
    ApiHours,
    ColumnIconMap,
    ParsedApiPay,
} from "../../../../../../../types/commonTypes";
import { formatDate } from "../../../../../../shared/utils/formatDates";
import HoursDifferenceCell from "../../../hours/HoursDifferenceCell";
import { roundTo } from "round-to";

export const hoursTableColumnsDef: ColumnDef<ApiHours>[] = [
    {
        header: "W/C",
        accessorKey: "week_commencing",
        accessorFn: (row) => row.week_commencing,
        cell: (cell) =>
            formatDate(cell.row.original.week_commencing, "dd/mm/yy"),
        filterFn: "inDateRange",
        id: "week_commencing",
        meta: { iconType: "numeric" },
    },
    {
        header: "Planned",
        accessorKey: "planned_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Overrun",
        accessorKey: "overrun_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Worked",
        accessorKey: "worked_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Normal",
        accessorKey: "normal_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Absent",
        accessorKey: "absent_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Core",
        accessorKey: "core_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Extra",
        accessorKey: "extra_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "Required",
        accessorKey: "weekly_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
    {
        header: "+/-",
        accessorKey: "weekly_hours_diff",
        cell: (cell) =>
            HoursDifferenceCell({
                weekly_hours_diff: cell.row.original.weekly_hours_diff,
            }),
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) =>
                HoursDifferenceCell({ weekly_hours_diff: val }),
        },
    },
    {
        header: "Total",
        accessorKey: "actual_hours",
        filterFn: "inNumberRange",
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: (val: number) => roundTo(val, 3),
        },
    },
];

export const payTableColumnIconTypes: ColumnIconMap<ParsedApiPay> = {
    pay_date: "numeric",
    basic_pay: "numeric",
    extra_pay: "numeric",
    gross_pay: "numeric",
    deductions_total: "numeric",
    net_pay: "numeric",
};
