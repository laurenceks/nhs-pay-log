import { roundTo } from "round-to";
import NumberFlow from "@number-flow/react";
import { Table } from "react-bootstrap";
import { msToDecimalHours } from "../../../../shared/utils/conversions.ts";

const ShiftEditModalCalculation = ({
    label,
    value,
    currency,
}: {
    label: string;
    value: number;
    currency?: boolean;
}) => {
    return (
        <Table className="w-auto mb-2" style={{ display: "inline-table" }}>
            <thead>
                <tr>
                    <th>{label}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <NumberFlow
                            value={
                                currency
                                    ? value
                                    : roundTo(msToDecimalHours(value), 5)
                            }
                            format={
                                currency
                                    ? { style: "currency", currency: "GBP" }
                                    : undefined
                            }
                        ></NumberFlow>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};

export default ShiftEditModalCalculation;
