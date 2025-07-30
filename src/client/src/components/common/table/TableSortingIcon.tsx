import { Column, SortDirection } from "@tanstack/react-table";
import { ColumnIconDataType } from "../../../../../../types/commonTypes";
import { ReactElement } from "react";
import {
    BsDot,
    BsSortAlphaDown,
    BsSortAlphaDownAlt,
    BsSortDownAlt,
    BsSortNumericDown,
    BsSortNumericDownAlt,
    BsSortUpAlt,
} from "react-icons/bs";
import IconWrap from "../IconWrap";

const iconMap: {
    [key in SortDirection]: {
        [key in "size" | "alpha" | "numeric"]: ReactElement;
    };
} = {
    asc: {
        alpha: <BsSortAlphaDown />,
        numeric: <BsSortNumericDown />,
        size: <BsSortDownAlt />,
    },
    desc: {
        alpha: <BsSortAlphaDownAlt />,
        numeric: <BsSortNumericDownAlt />,
        size: <BsSortUpAlt />,
    },
};
const TableSortingIcon = <T,>({
    column,
    dataType = "alpha",
}: {
    column: Column<T, unknown>;
    dataType?: ColumnIconDataType;
}) => {
    const currentSort = column.getIsSorted();
    return (
        //invisible but maintains width
        <IconWrap
            variant="dark"
            width={20}
            className={`ms-1 ${currentSort ? "" : "opacity-0"}`}
        >
            {currentSort ? iconMap[currentSort][dataType] : <BsDot />}
        </IconWrap>
    );
};

export default TableSortingIcon;
