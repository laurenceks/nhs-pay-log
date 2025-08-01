import { Dispatch, SetStateAction } from "react";
import { Badge, Button } from "react-bootstrap";
import IconWrap from "../../IconWrap";
import { IoFunnel } from "react-icons/io5";

const FilterButton = ({
    showFilters,
    setShowFilters,
    activeFiltersCount,
}: {
    showFilters: boolean;
    setShowFilters: Dispatch<SetStateAction<boolean>>;
    activeFiltersCount: number;
}) => {
    return (
        <div className="position-relative">
            <Button
                variant={showFilters ? "dark" : "secondary"}
                className="d-flex align-items-center justify-content-center px-2"
                onClick={() => setShowFilters(!showFilters)}
            >
                <IconWrap width={"1.5rem"} as="span">
                    <IoFunnel />
                </IconWrap>
            </Button>
            {!!activeFiltersCount && (
                <Badge
                    as={"div"}
                    className={`position-absolute top-0 end-0 ${showFilters ? "" : "border border-1"}`}
                    pill={true}
                    bg={showFilters ? "dark" : "secondary"}
                    style={{
                        transform: "translate(50%, -50%)",
                        borderColor: "rgb(229.5, 229.5, 229.5)",
                    }}
                >
                    {activeFiltersCount}
                </Badge>
            )}
        </div>
    );
};

export default FilterButton;
