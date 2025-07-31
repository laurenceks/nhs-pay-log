import { Form } from "react-bootstrap";
import { Column } from "@tanstack/react-table";

type Val = [number | string | undefined, number | string | undefined];
const FilterRange = <T,>({
    type,
    column,
}: {
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
                defaultValue={currentVal[0]}
                onBlur={(e) => {
                    const parsedVal =
                        type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                    column.setFilterValue([
                        e.target.value ? parsedVal : undefined,
                        currentVal[1],
                    ]);
                }}
            ></Form.Control>
            <Form.Control
                className="xs"
                type={type}
                defaultValue={currentVal[1]}
                onBlur={(e) => {
                    const parsedVal =
                        type === "number"
                            ? Number(e.target.value)
                            : e.target.value;
                    column.setFilterValue([
                        currentVal[0],
                        e.target.value ? parsedVal : undefined,
                    ]);
                }}
            ></Form.Control>
        </div>
    );
};
export default FilterRange;
