import { Form, Table } from "react-bootstrap";
import { ParsedApiShift } from "../../../../../types/commonTypes";
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    logTableColumnIconTypes as columnIdIconTypeMap,
    logTableColumnsDef,
} from "../../columnDefs/logTableColumnsDef";
import LogTableRow from "./LogTableRow";
import { useMemo, useState } from "react";
import TableSortingIcon from "../common/table/TableSortingIcon";

const LogTable = ({ log }: { log: ParsedApiShift[] }) => {
    const columns = useMemo(() => logTableColumnsDef, []);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: log,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        maxMultiSortColCount: 3,
    });

    return (
        <div>
            <Table striped={true} hover={true} responsive={true}>
                <thead>
                    <tr>
                        <th colSpan={7}>Shift</th>
                        <th colSpan={7}>Earnings</th>
                    </tr>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="sticky-top">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    style={{
                                        cursor: header.column.getCanSort()
                                            ? "pointer"
                                            : "default",
                                    }}
                                    className="position-relative table-th-filter"
                                >
                                    <div
                                        onClick={
                                            header.column.getCanSort()
                                                ? header.column.getToggleSortingHandler()
                                                : undefined
                                        }
                                        className="d-flex align-items-center"
                                    >
                                        <span>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </span>
                                        <TableSortingIcon
                                            column={header.column}
                                            dataType={
                                                columnIdIconTypeMap[
                                                    header.column
                                                        .id as keyof typeof columnIdIconTypeMap
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className="position-absolute top-100 start-0 w-100 px-3 pt-1 pb-3 table-th-filter-input">
                                        <Form.Control
                                            className="xs"
                                            type="text"
                                            onBlur={(e) =>
                                                header.column.setFilterValue(
                                                    e.currentTarget.value
                                                )
                                            }
                                        ></Form.Control>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <LogTableRow key={row.id} row={row} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default LogTable;
