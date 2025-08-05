import { Dispatch, SetStateAction } from "react";
import { Button, Dropdown } from "react-bootstrap";
import IconWrap from "../../IconWrap";
import { Aggregations } from "../../../../../../../types/commonTypes";

const AggregationButton = ({
    aggregation,
    setAggregation,
}: {
    aggregation: Aggregations | null;
    setAggregation: Dispatch<SetStateAction<Aggregations | null>>;
}) => {
    return (
        <>
            <Button
                variant={aggregation ? "dark" : "secondary"}
                className="d-flex align-items-center justify-content-center py-0 px-2 fw-bolder"
                style={{ fontSize: "1.5rem", lineHeight: "1.25rem" }}
                onClick={() =>
                    setAggregation((prevState) => (prevState ? null : "sum"))
                }
            >
                <IconWrap width={"1.5rem"} as="span">
                    <span>∑</span>
                </IconWrap>
            </Button>
            {aggregation && (
                <Dropdown className="d-flex">
                    <Dropdown.Toggle
                        title={aggregation.toUpperCase()}
                        variant={"dark"}
                    >
                        {aggregation.toUpperCase()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={() => setAggregation("sum")}>
                            Sum
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setAggregation("mean")}>
                            Mean
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setAggregation("median")}>
                            Median
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setAggregation("max")}>
                            Max
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setAggregation("min")}>
                            Min
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </>
    );
};

export default AggregationButton;
