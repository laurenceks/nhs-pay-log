import { Button } from "react-bootstrap";
import { CSSProperties, ReactElement } from "react";
import IconWrap from "../common/IconWrap";
import { Variant } from "react-bootstrap/types";

const SettingsContractRowEditButton = ({
    onClick,
    variant,
    children,
}: {
    onClick: () => void;
    variant: Variant;
    children: ReactElement<{ className?: string; style?: CSSProperties }>;
}) => {
    return (
        <Button
            variant={variant}
            size="sm"
            className="d-flex align-items-center justify-content-center p-0"
            onClick={onClick}
        >
            <IconWrap variant="white" width={"1.5rem"} as="span">
                {children}
            </IconWrap>
        </Button>
    );
};

export default SettingsContractRowEditButton;
