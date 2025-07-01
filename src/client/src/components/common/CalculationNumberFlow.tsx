import { roundTo } from "round-to";
import NumberFlow from "@number-flow/react";
import { msToDecimalHours } from "../../../../shared/utils/conversions";

const CalculationNumberFlow = ({
    value,
    currency,
    precision = 3,
}: {
    value: number | string;
    currency?: boolean;
    precision?: number;
}) => {
    const parsedValue = typeof value === "string" ? Number(value) : value;
    return (
        <NumberFlow
            value={
                currency
                    ? parsedValue
                    : roundTo(msToDecimalHours(parsedValue), precision)
            }
            format={
                currency ? { style: "currency", currency: "GBP" } : undefined
            }
        ></NumberFlow>
    );
};

export default CalculationNumberFlow;
