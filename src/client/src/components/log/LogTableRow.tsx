import { ParsedApiShift } from "../../../../../types/commonTypes";
import { memo } from "react";
import { Row } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import LogTableCell from "./LogTableCell";

// eslint-disable-next-line react/display-name
const LogTableRow = memo(({ row }: { row: Row<ParsedApiShift> }) => {
    const navigate = useNavigate();
    return (
        <tr
            key={row.id}
            style={{ cursor: "pointer" }}
            onClick={() =>
                navigate({
                    to: "/log/$shiftId",
                    params: {
                        shiftId: row.original.id.toString(),
                    },
                })
            }
        >
            {row.getVisibleCells().map((cell) => (
                <LogTableCell key={cell.id} cell={cell} />
            ))}
        </tr>
    );
});

export default LogTableRow;
