import { Cell, flexRender } from "@tanstack/react-table";
import { memo } from "react";
import { ParsedApiShift } from "../../../../../types/commonTypes";

// eslint-disable-next-line react/display-name
const LogTableCell = memo(
    ({ cell }: { cell: Cell<ParsedApiShift, unknown> }) => {
        return (
            <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
        );
    }
);

export default LogTableCell;
