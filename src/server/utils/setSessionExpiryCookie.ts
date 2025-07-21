import { Request, Response } from "express";

const setSessionExpiryCookie = (req: Request, res: Response) => {
    const expires = req.session.cookie.originalMaxAge
        ? new Date(Date.now() + req.session.cookie.originalMaxAge)
        : new Date();

    res.cookie("sessionExpiry", expires.toISOString(), {
        expires,
        secure: true,
        maxAge: req.session.cookie.originalMaxAge || 0,
        domain: req.session.cookie.domain,
        sameSite: true,
        path: "/",
    });
};

export default setSessionExpiryCookie;
