import { Form } from "react-bootstrap";
import { Column } from "@tanstack/react-table";

const FilterString = <T,>({ column }: { column: Column<T> }) => (
    <Form.Control
        className="xs"
        type="text"
        defaultValue={column.getFilterValue() as string}
        onBlur={(e) => {
            column.setFilterValue(e.currentTarget.value);
        }}
    ></Form.Control>
);
export default FilterString;
