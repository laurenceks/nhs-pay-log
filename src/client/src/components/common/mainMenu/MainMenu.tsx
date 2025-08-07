import { Link } from "@tanstack/react-router";
import LoginWrapper from "../../login/LoginWrapper";
import MainMenuButton from "./MainMenuButton";

const MainMenu = () => {
    return (
        <LoginWrapper>
            <div className="d-flex flex-column mx-auto gap-3">
                <div>
                    <h5>Welcome</h5>
                    <p className="small text-muted">
                        Select an option to continue{" "}
                    </p>
                </div>
                <MainMenuButton
                    to={"/log"}
                    buttonVariant="primary"
                    tooltipVariant="primary"
                    tooltipText="Create, edit and delete shifts"
                >
                    Log
                </MainMenuButton>
                <MainMenuButton
                    to={"/pay"}
                    buttonVariant="success"
                    tooltipVariant="success"
                    tooltipText="See each month's pay"
                >
                    Pay
                </MainMenuButton>
                <MainMenuButton
                    to={"/settings"}
                    buttonVariant="light"
                    tooltipVariant="dark"
                    tooltipText="Change employment parameters"
                >
                    Settings
                </MainMenuButton>
                <Link to={"/logout"} className="btn btn-outline-primary">
                    Logout
                </Link>
            </div>
        </LoginWrapper>
    );
};

export default MainMenu;
