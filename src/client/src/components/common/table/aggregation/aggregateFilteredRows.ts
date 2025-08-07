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
                const filteredColumns: {
                    [key in (typeof aggregationIds)[number]]: (
                        | string
                        | number
                    )[];
                } = {};
                const rows = table.getFilteredRowModel().rows;
                rows.forEach((row) => {
                    aggregationIds.forEach((x) => {
                        if (filteredColumns[x]) {
                            filteredColumns[x].push(row.getValue(x));
                        } else {
                            filteredColumns[x] = [row.getValue(x)];
                        }
                    });
                });
                aggregationIds.forEach((x) => {
                    aggregated[x] =
                        filteredColumns[x]?.sort()[
                            Math.floor(filteredColumns[x].length / 2)
                        ] ||
                        (typeof table.getRow("0").getValue(x) === "number"
                            ? 0
                            : "");
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
