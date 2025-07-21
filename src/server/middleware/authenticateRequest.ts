import logoutAndDestroySession from "../utils/logoutAndDestroySession";
import { sendErrorRes } from "../utils/sendRes";
import { ApiUser, ClientUser } from "../../../types/commonTypes";
import { NextFunction, Request, Response } from "express";
import setSessionExpiryCookie from "../utils/setSessionExpiryCookie";

const authenticateRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user } = req;
    if (user && req.isAuthenticated() && (user as ApiUser).verified) {
        req.authenticatedUser = user as ClientUser;
        setSessionExpiryCookie(req, res);
        next();
    } else {
        // user not authenticated - destroy session
        logoutAndDestroySession(req, res);
        sendErrorRes(res, "unauthorised");
    }
};
export default authenticateRequest;
