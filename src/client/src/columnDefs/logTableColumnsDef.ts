import { ColumnDef } from "@tanstack/react-table";
import { ColumnIconMap, ParsedApiShift } from "../../../../types/commonTypes";
import { convertToGbp } from "../../../shared/utils/conversions";

export const logTableColumnsDef: ColumnDef<ParsedApiShift>[] = [
    {
        header: "Date",
        accessorKey: "from",
        accessorFn: (row) => row.date,
        cell: (cell) => cell.row.original.from,
        filterFn: "includesString",
    },
    {
        header: "Start",
        accessorKey: "start",
        filterFn: "includesString",
    },
    {
        header: "Planned end",
        accessorKey: "planned_end",
        filterFn: "includesString",
    },
    {
        header: "Actual end",
        accessorKey: "actual_end",
        filterFn: "includesString",
    },
    {
        header: "Employer",
        accessorKey: "employment_name",
        filterFn: "includesString",
    },
    {
        header: "Type",
        accessorKey: "type",
        filterFn: "includesString",
    },
    {
        header: "Overrun type",
        accessorKey: "overrun_type",
        filterFn: "arrIncludes",
    },
    {
        header: "TOIL",
        accessorKey: "toil",
        filterFn: "arrIncludes",
    },
    {
        header: "USH lower",
        accessorKey: "lower_rate",
        filterFn: "inNumberRange",
    },
    {
        header: "USH higher",
        accessorKey: "higher_rate",
        filterFn: "inNumberRange",
    },
    {
        header: "Flat",
        accessorKey: "flat",
        filterFn: "inNumberRange",
    },
    {
        header: "Time and a half",
        accessorKey: "time_and_half",
        filterFn: "inNumberRange",
    },
    {
        header: "Double",
        accessorKey: "double",
        filterFn: "inNumberRange",
    },
    {
        header: "Extra pay",
        accessorKey: "extra_pay",
        accessorFn: (row) => row.extra_pay,
        cell: (cell) => convertToGbp(cell.row.original.extra_pay),
        filterFn: "inNumberRange",
    },
];

export const logTableColumnIconTypes: ColumnIconMap<ParsedApiShift> = {
    date: "numeric",
    start: "numeric",
    planned_end: "numeric",
    actual_end: "numeric",
    toil: "numeric",
    lower_rate: "numeric",
    higher_rate: "numeric",
    flat: "numeric",
    time_and_half: "numeric",
    double: "numeric",
    extra_pay: "numeric",
};
