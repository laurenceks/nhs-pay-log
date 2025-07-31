import { flexRender, Header } from "@tanstack/react-table";
import TableSortingIcon from "./TableSortingIcon";

const TanStackTableTh = <T,>({ header }: { header: Header<T, unknown> }) => {
    return (
        <th
            style={{
                cursor: header.column.getCanSort() ? "pointer" : "default",
            }}
            onClick={
                header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
            }
        >
            <div className="d-flex align-items-center">
                <span>
                    {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                </span>
                <TableSortingIcon
                    column={header.column}
                    dataType={
                        header.column.columnDef.meta?.iconType || undefined
                    }
                />
            </div>
        </th>
    );
};

export default TanStackTableTh;
