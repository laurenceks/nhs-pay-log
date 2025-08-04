import { Button, Form } from "react-bootstrap";
import { Column } from "@tanstack/react-table";
import IconWrap from "../../IconWrap";
import { IoCloseCircle } from "react-icons/io5";
import { useRef } from "react";

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
    const input1 = useRef<HTMLInputElement | null>(null);
    const input2 = useRef<HTMLInputElement | null>(null);

    return (
        <div className="d-flex flex-column gap-1">
            <div className={"d-flex gap-1 filter-container"}>
                <Form.Control
                    ref={input1}
                    className="xs"
                    type={type}
                    defaultValue={currentVal[0]}
                    onBlur={(e) => {
                        const parsedVal =
                            type === "number"
                                ? Number(e.target.value)
                                : e.target.value;
                        column.setFilterValue(
                            !e.target.value && !currentVal[1]
                                ? undefined
                                : [
                                      e.target.value ? parsedVal : undefined,
                                      currentVal[1],
                                  ]
                        );
                    }}
                ></Form.Control>
                {type !== "number" && (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="d-flex align-items-center justify-content-center p-1"
                        onClick={() => {
                            if (input1.current) {
                                input1.current.value = "";
                            }
                            column.setFilterValue(
                                !currentVal[1]
                                    ? undefined
                                    : [undefined, currentVal[1]]
                            );
                        }}
                    >
                        <IconWrap width={"1rem"}>
                            <IoCloseCircle />
                        </IconWrap>
                    </Button>
                )}
            </div>
            <div className="d-flex gap-1 filter-container">
                <Form.Control
                    ref={input2}
                    className="xs"
                    type={type}
                    defaultValue={currentVal[1]}
                    onBlur={(e) => {
                        const parsedVal =
                            type === "number"
                                ? Number(e.target.value)
                                : e.target.value;
                        column.setFilterValue(
                            !e.target.value && !currentVal[0]
                                ? undefined
                                : [
                                      currentVal[0],
                                      e.target.value ? parsedVal : undefined,
                                  ]
                        );
                    }}
                ></Form.Control>
                {type !== "number" && (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="d-flex align-items-center justify-content-center p-1"
                        onClick={() => {
                            if (input2.current) {
                                input2.current.value = "";
                            }
                            column.setFilterValue(
                                !currentVal[0]
                                    ? undefined
                                    : [currentVal[0], undefined]
                            );
                        }}
                    >
                        <IconWrap width={"1rem"}>
                            <IoCloseCircle />
                        </IconWrap>
                    </Button>
                )}
            </div>
        </div>
    );
};
export default FilterRange;
