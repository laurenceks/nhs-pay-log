import { CellContext, ColumnDef } from "@tanstack/react-table";
import {
    ColumnIconMap,
    ParsedApiPay,
} from "../../../../../../../types/commonTypes";
import { formatDate } from "../../../../../../shared/utils/formatDates";
import { convertToGbp } from "../../../../../../shared/utils/conversions";

const renderAsGbp = (cell: CellContext<ParsedApiPay, unknown>) =>
    convertToGbp(cell.getValue() as number);
export const payTableColumnsDef: ColumnDef<ParsedApiPay>[] = [
    {
        header: "Pay date",
        accessorKey: "pay_date",
        accessorFn: (row) => row.pay_date,
        cell: (cell) => formatDate(cell.row.original.pay_date, "pay"),
        filterFn: "inDateRange",
        id: "pay_date",
        meta: { iconType: "numeric" },
    },
    {
        header: "Employment",
        accessorKey: "employment_name",
        filterFn: "includesString",
    },
    {
        header: "Basic",
        accessorKey: "basic_pay",
        filterFn: "inNumberRange",
        cell: renderAsGbp,
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: convertToGbp,
        },
    },
    {
        header: "Extra",
        accessorKey: "extra_pay",
        filterFn: "inNumberRange",
        cell: renderAsGbp,
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: convertToGbp,
        },
    },
    {
        header: "Gross",
        accessorKey: "gross_pay",
        filterFn: "inNumberRange",
        cell: renderAsGbp,
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: convertToGbp,
        },
    },
    {
        header: "Deductions",
        accessorKey: "deductions_total",
        filterFn: "inNumberRange",
        cell: renderAsGbp,
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: convertToGbp,
        },
    },
    {
        header: "Net",
        accessorKey: "net_pay",
        filterFn: "inNumberRange",
        cell: renderAsGbp,
        meta: {
            iconType: "numeric",
            aggregationTypes: "all",
            aggregationDisplayFn: convertToGbp,
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
