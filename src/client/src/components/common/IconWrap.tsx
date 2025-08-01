import {
    cloneElement,
    createElement,
    CSSProperties,
    ReactElement,
} from "react";
import { Variant } from "react-bootstrap/types";

const IconWrap = ({
    children,
    variant,
    width = 100,
    className = "",
    as = "div",
}: {
    children: ReactElement<{ className?: string; style?: CSSProperties }>;
    variant?: Variant;
    width?: number | string;
    as?: keyof HTMLElementTagNameMap;
    className?: string;
}) => {
    const sizeString = typeof width === "number" ? `${width}px` : width;
    return createElement(
        as,
        {
            className: `text-${variant} d-inline-flex justify-content-center align-items-center w-100 ${className}`,
            style: {
                maxWidth: sizeString,
                maxHeight: sizeString,
            },
        },
        cloneElement(children, {
            className: "align-self-center",
            style: { width: sizeString, height: sizeString },
        })
    );
};

export default IconWrap;
