import { Row, Table as TanTable } from "@tanstack/react-table";
import { Table } from "react-bootstrap";
import Filter from "./filters/Filter";
import TanStackTableTh from "./TanStackTableTh";
import TanStackTableTbodyTr from "./TanStackTableTbodyTr";
import { Aggregations } from "../../../../../../types/commonTypes";
import TanStackTableAggregationRow from "./TanStackTableAggregationRow";

const TanStackTable = <T,>({
    table,
    showFilters,
    rowClick,
    aggregation = null,
}: {
    table: TanTable<T>;
    showFilters: boolean;
    rowClick?: (row: Row<T>) => void;
    aggregation?: Aggregations | null;
}) => {
    return (
        <div className="pb-5">
            <Table striped={true} hover={true} responsive={true}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} className="sticky-top">
                            {headerGroup.headers.map((header) => (
                                <TanStackTableTh
                                    key={header.id}
                                    header={header}
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
                {aggregation && (
                    <TanStackTableAggregationRow
                        table={table}
                        aggregation={aggregation}
                    />
                )}
            </Table>
        </div>
    );
};

export default TanStackTable;
