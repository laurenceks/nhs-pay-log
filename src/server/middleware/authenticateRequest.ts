import logoutAndDestroySession from "../utils/logoutAndDestroySession";
import { sendErrorRes } from "../utils/sendRes";
import { ClientUser } from "../../../types/commonTypes";
import { NextFunction, Request, Response } from "express";

const authenticateRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user } = req;
    if (user && req.isAuthenticated()) {
        req.authenticatedUser = user as ClientUser;
        next();
    } else {
        // user not authenticated - destroy session
        logoutAndDestroySession(req, res);
        sendErrorRes(res, "unauthorised");
    }
};
export default authenticateRequest;
