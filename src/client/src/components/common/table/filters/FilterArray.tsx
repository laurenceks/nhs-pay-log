import { Dropdown } from "react-bootstrap";
import IconWrap from "../../IconWrap";
import { IoCheckbox, IoCloseCircle, IoSquareOutline } from "react-icons/io5";
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
            column.setFilterValue(newState.length ? newState : undefined);
        }
    };

    return (
        <Dropdown autoClose={"outside"}>
            <Dropdown.Toggle
                size="sm"
                title={column.columnDef.header as string}
                variant="outline-secondary"
                disabled={!columnFilterLists[column.id]?.length}
            >
                {column.columnDef.header as string}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() => column.setFilterValue(undefined)}
                    className="d-flex align-items-center gap-1"
                >
                    <IconWrap variant="dark" width={"1rem"}>
                        <IoCloseCircle />
                    </IconWrap>
                    Clear all
                </Dropdown.Item>
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
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default FilterArray;
