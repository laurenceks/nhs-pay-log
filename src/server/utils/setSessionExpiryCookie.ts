import { Request, Response } from "express";

const setSessionExpiryCookie = (req: Request, res: Response) => {
    const expires = req.session.cookie.originalMaxAge
        ? new Date(Date.now() + req.session.cookie.originalMaxAge)
        : new Date();

    res.cookie("sessionExpiry", expires.toISOString(), {
        expires,
        secure: process.env.NODE_ENV === "production",
        maxAge: req.session.cookie.originalMaxAge || 0,
        domain:
            process.env.NODE_ENV === "production"
                ? req.session.cookie.domain
                : undefined,
        sameSite: true,
        path: "/",
    });
};

export default setSessionExpiryCookie;
