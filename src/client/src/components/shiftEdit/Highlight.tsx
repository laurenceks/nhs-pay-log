import { Variant } from "react-bootstrap/types";
import { ReactNode } from "react";

const Highlight = ({
    children,
    bg = "danger",
    text = "white",
}: {
    children: ReactNode;
    bg?: Variant;
    text?: Variant | "white" | "black";
}) => {
    return (
        <span className={`bg-${bg} text-${text} rounded rounded-1 p-1`}>
            {children}
        </span>
    );
};

export default Highlight;
