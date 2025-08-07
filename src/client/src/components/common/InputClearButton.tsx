import IconWrap from "./IconWrap";
import { Button } from "react-bootstrap";
import { IoCloseCircle } from "react-icons/io5";

const InputClearButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        size="sm"
        variant="secondary"
        className="d-flex align-items-center justify-content-center p-1"
        onClick={onClick}
    >
        <IconWrap width={"1rem"}>
            <IoCloseCircle />
        </IconWrap>
    </Button>
);
export default InputClearButton;
