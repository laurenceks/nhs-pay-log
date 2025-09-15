import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, LinkOptions } from "@tanstack/react-router";
import { Variant } from "react-bootstrap/types";

const MainMenuButton = ({
    tooltipVariant,
    buttonVariant,
    to,
    tooltipText,
    children,
}: {
    tooltipVariant: Variant;
    buttonVariant: Variant;
    to: LinkOptions["to"];
    tooltipText: string;
    children: string;
}) => {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip
                    className={`main-menu-tooltip position-fixed ${tooltipVariant}`}
                >
                    {tooltipText}
                </Tooltip>
            }
        >
            <div className="w-100">
                <Link to={to} className={`w-100 btn btn-${buttonVariant}`}>
                    {children}
                </Link>
            </div>
        </OverlayTrigger>
    );
};

export default MainMenuButton;
