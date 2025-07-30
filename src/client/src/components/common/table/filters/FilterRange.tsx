import { Form } from "react-bootstrap";
import { Column } from "@tanstack/react-table";

type Val = [number | string | undefined, number | string | undefined];
const FilterRange = <T,>({
    onBlur,
    type,
    column,
}: {
    onBlur: (val: Val) => void;
    type?: "number" | "date" | "time";
    column: Column<T>;
}) => {
    const currentVal = (column.getFilterValue() as Val) || [
        undefined,
        undefined,
    ];
    return (
        <div className="d-flex flex-wrap gap-1">
            <Form.Control
                className="xs"
                type={type}
                onBlur={(e) => {
                    const parsedVal =
                        type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                    onBlur([
                        e.target.value ? parsedVal : undefined,
                        currentVal[1],
                    ]);
                    onBlur(currentVal);
                }}
            ></Form.Control>
            <Form.Control
                className="xs"
                type={type}
                onBlur={(e) => {
                    const parsedVal =
                        type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                    onBlur([
                        currentVal[0],
                        e.target.value ? parsedVal : undefined,
                    ]);
                    onBlur(currentVal);
                }}
            ></Form.Control>
        </div>
    );
};
export default FilterRange;
