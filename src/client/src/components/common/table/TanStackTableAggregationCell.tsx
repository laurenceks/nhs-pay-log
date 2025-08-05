import { Header } from "@tanstack/react-table";
import { Aggregated } from "../../../../../../types/commonTypes";

const TanStackTableAggregationCell = <T,>({
    header,
    aggregated,
}: {
    header: Header<T, unknown>;
    aggregated: Aggregated;
}) => {
    if (header.id in aggregated) {
        return (
            <td>
                {header.column.columnDef.meta?.aggregationDisplayFn
                    ? header.column.columnDef.meta?.aggregationDisplayFn(
                          aggregated[header.id]
                      )
                    : aggregated[header.id] || ""}
            </td>
        );
    } else {
        return <td></td>;
    }
};

export default TanStackTableAggregationCell;
