import { Table } from "@tanstack/react-table";
import {
    Aggregated,
    Aggregations,
} from "../../../../../../../types/commonTypes";

const aggregateFilteredRows = <T>(
    table: Table<T>,
    aggregation: Aggregations
) => {
    let aggregated: Aggregated = {};
    const aggregationIds: string[] = [];
    table.getHeaderGroups().forEach((headerGroup) => {
        headerGroup.headers.forEach((header) => {
            if (header.column.columnDef.meta?.aggregationTypes) {
                if (
                    !!header.column.columnDef.meta?.aggregationTypes?.length &&
                    (header.column.columnDef.meta?.aggregationTypes === "all" ||
                        header.column.columnDef.meta?.aggregationTypes?.includes(
                            aggregation
                        ))
                ) {
                    aggregationIds.push(header.id);
                }
            }
        });
    });

    switch (aggregation) {
        case "median":
            {
                //TODO sort the array before selecting the median!
                const midRow =
                    table.getFilteredRowModel().rows[
                        Math.floor(table.getFilteredRowModel().rows.length / 2)
                    ];
                aggregationIds.forEach((x) => {
                    aggregated[x] = midRow.getValue(x);
                });
            }
            break;
        case "min":
        case "max":
            {
                aggregated = table
                    .getFilteredRowModel()
                    .rows.reduce((previousValue, currentValue) => {
                        const newValue = { ...previousValue };
                        aggregationIds.forEach((x) => {
                            if (
                                previousValue[x] !== undefined &&
                                previousValue[x] !== null
                            ) {
                                newValue[x] =
                                    (aggregation === "max" &&
                                        previousValue[x] >
                                            (currentValue.getValue(x) as
                                                | string
                                                | number)) ||
                                    (aggregation === "min" &&
                                        previousValue[x] <
                                            (currentValue.getValue(x) as
                                                | string
                                                | number))
                                        ? previousValue[x]
                                        : currentValue.getValue(x);
                            } else {
                                newValue[x] = currentValue.getValue(x);
                            }
                        });
                        return newValue;
                    }, aggregated);
            }
            break;
        case "mean":
        case "sum":
        default: {
            const rows = table.getFilteredRowModel().rows;
            aggregated = rows.reduce((previousValue, currentValue) => {
                const newValue = { ...previousValue };
                aggregationIds.forEach((x) => {
                    if (previousValue[x]) {
                        newValue[x] =
                            aggregation === "mean"
                                ? (previousValue[x] as number) +
                                  (currentValue.getValue(x) as number) /
                                      (rows.length || 1)
                                : (previousValue[x] as number) +
                                  (currentValue.getValue(x) as number);
                    } else {
                        newValue[x] =
                            aggregation === "mean"
                                ? (currentValue.getValue(x) as number) /
                                  (rows.length || 1)
                                : (currentValue.getValue(x) as number);
                    }
                });
                return newValue;
            }, aggregated);
        }
    }
    return aggregated;
};

export default aggregateFilteredRows;
