import { ReactNode } from "react";
import { Button } from "react-bootstrap";
import { useMatch, useNavigate } from "@tanstack/react-router";

const NavButton = ({
    children,
    activePath,
    to,
}: {
    children: ReactNode;
    activePath: string;
    to: string;
}) => {
    const navigate = useNavigate();
    return (
        <Button
            size="sm"
            variant={
                useMatch({
                    from: activePath,
                    shouldThrow: false,
                    strict: true,
                })
                    ? "primary"
                    : "light"
            }
            onClick={() => navigate({ to })}
        >
            {children}
        </Button>
    );
};
export default NavButton;
