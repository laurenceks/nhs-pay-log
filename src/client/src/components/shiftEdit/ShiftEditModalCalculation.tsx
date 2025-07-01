import { Table } from "react-bootstrap";
import CalculationNumberFlow from "../common/CalculationNumberFlow";

const ShiftEditModalCalculation = ({
    label,
    value,
    currency,
}: {
    label: string;
    value: number | string;
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
                        <CalculationNumberFlow
                            value={value}
                            currency={currency}
                            precision={5}
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
};

export default ShiftEditModalCalculation;
