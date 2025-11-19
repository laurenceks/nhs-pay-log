import IconWrap from "./IconWrap";
import { Button } from "react-bootstrap";
import { IoCloseCircle } from "react-icons/io5";

const InputClearButton = ({
    onClick,
    square = true,
    size = "1rem",
}: {
    onClick: () => void;
    square?: boolean;
    size?: string;
}) => (
    <Button
        size="sm"
        variant="secondary"
        className="d-flex align-items-center justify-content-center p-1"
        onClick={onClick}
        style={square ? { aspectRatio: 1 } : {}}
    >
        <IconWrap width={size}>
            <IoCloseCircle />
        </IconWrap>
    </Button>
);
export default InputClearButton;
