import { Dropdown, DropdownButton } from "react-bootstrap";
import IconWrap from "../../IconWrap";
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";
import { Column } from "@tanstack/react-table";
import columnFilterLists from "../columnDefs/columnFilterLists";

const FilterArray = <T,>({ column }: { column: Column<T> }) => {
    const selected = (column.getFilterValue() as string[]) || [];
    const onClick = (val: string) => {
        const index = selected.indexOf(val);

        if (index === -1) {
            column.setFilterValue([...selected, val]);
        } else {
            const newState = [...selected];
            newState.splice(index, 1);
            column.setFilterValue(newState);
        }
    };

    return (
        <DropdownButton
            size="sm"
            title={column.columnDef.header as string}
            variant="outline-secondary"
            autoClose={"outside"}
        >
            {(columnFilterLists[column.id] || []).map((x) => (
                <Dropdown.Item
                    key={x}
                    onClick={() => onClick(x)}
                    className="d-flex align-items-center gap-1"
                >
                    <IconWrap variant="dark" width={"1rem"}>
                        {selected.includes(x) ? (
                            <IoCheckbox />
                        ) : (
                            <IoSquareOutline />
                        )}
                    </IconWrap>
                    {x}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
};
export default FilterArray;
