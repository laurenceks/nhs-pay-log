import { ColumnDef } from "@tanstack/react-table";
import {
    ApiHours,
    ColumnIconMap,
    ParsedApiPay,
} from "../../../../../../../types/commonTypes";
import { formatDate } from "../../../../../../shared/utils/formatDates";
import HoursDifferenceCell from "../../../hours/HoursDifferenceCell";

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
        meta: { iconType: "numeric", aggregationTypes: "all" },
    },
    {
        header: "Actual",
        accessorKey: "actual_hours",
        filterFn: "inNumberRange",
        meta: { iconType: "numeric", aggregationTypes: "all" },
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
        header: "Overrun",
        accessorKey: "overrun_hours",
        filterFn: "inNumberRange",
        meta: { iconType: "numeric", aggregationTypes: "all" },
    },
    {
        header: "Extra hours",
        accessorKey: "extra_hours",
        filterFn: "inNumberRange",
        meta: { iconType: "numeric", aggregationTypes: "all" },
    },
    {
        header: "Absent hours",
        accessorKey: "absent_hours",
        filterFn: "inNumberRange",
        meta: { iconType: "numeric", aggregationTypes: "all" },
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
