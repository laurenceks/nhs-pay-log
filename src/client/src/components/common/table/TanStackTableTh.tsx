import { flexRender, Header } from "@tanstack/react-table";
import { ColumnIconMap } from "../../../../../../types/commonTypes";
import TableSortingIcon from "./TableSortingIcon";

const TanStackTableTh = <T,>({
    header,
    iconTypes,
}: {
    header: Header<T, unknown>;
    iconTypes: ColumnIconMap<T>;
}) => {
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
                        iconTypes[header.column.id as keyof typeof iconTypes]
                    }
                />
            </div>
        </th>
    );
};

export default TanStackTableTh;
