import { flexRender, Row } from "@tanstack/react-table";

const TanStackTableTbodyTr = <T,>({
    row,
    rowClick,
}: {
    row: Row<T>;
    rowClick?: (row: Row<T>) => void;
}) => {
    return (
        <tr
            key={row.id}
            style={{ cursor: rowClick ? "pointer" : "default" }}
            onClick={() => {
                if (rowClick) {
                    rowClick(row);
                }
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    className={
                        cell.column.columnDef.meta?.textVariant
                            ? `text-${cell.column.columnDef.meta?.textVariant}`
                            : ""
                    }
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
};

export default TanStackTableTbodyTr;
