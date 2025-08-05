import { Table as TanTable } from "@tanstack/react-table";
import { Aggregations } from "../../../../../../types/commonTypes";
import aggregateFilteredRows from "./aggregation/aggregateFilteredRows";
import TanStackTableAggregationCell from "./TanStackTableAggregationCell";

const TanStackTableAggregationRow = <T,>({
    table,
    aggregation,
}: {
    table: TanTable<T>;
    aggregation: Aggregations;
}) => {
    const aggregated = aggregateFilteredRows(table, aggregation);
    return (
        <tfoot className="table-group-divider fw-bold">
            {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TanStackTableAggregationCell
                            key={header.id}
                            header={header}
                            aggregated={aggregated}
                        />
                    ))}
                </tr>
            ))}
        </tfoot>
    );
};

export default TanStackTableAggregationRow;
