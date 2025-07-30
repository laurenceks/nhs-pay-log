import { Row, Table as TanTable } from "@tanstack/react-table";
import { Table } from "react-bootstrap";
import { ColumnIconMap } from "../../../../../../types/commonTypes";
import Filter from "./filters/Filter";
import TanStackTableTh from "./TanStackTableTh";
import TanStackTableTbodyTr from "./TanStackTableTbodyTr";

const TanStackTable = <T,>({
    table,
    showFilters,
    iconTypes,
    rowClick,
}: {
    table: TanTable<T>;
    showFilters: boolean;
    iconTypes: ColumnIconMap<T>;
    rowClick?: (row: Row<T>) => void;
}) => {
    return (
        <div>
            <Table striped={true} hover={true} responsive={true}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="sticky-top">
                            {headerGroup.headers.map((header) => (
                                <TanStackTableTh
                                    key={header.id}
                                    header={header}
                                    iconTypes={iconTypes}
                                />
                            ))}
                        </tr>
                    ))}
                    {showFilters &&
                        table.getHeaderGroups().map((headerGroup) => {
                            return (
                                <tr key={headerGroup.id} className="sticky-top">
                                    {headerGroup.headers.map((header) => (
                                        <th key={`${header.id}-filter`}>
                                            {header.column.getCanFilter() && (
                                                <Filter
                                                    column={header.column}
                                                />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            );
                        })}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <TanStackTableTbodyTr
                            key={row.id}
                            row={row}
                            rowClick={rowClick}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TanStackTable;
