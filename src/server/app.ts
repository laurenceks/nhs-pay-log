import { configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { dbOptions } from "./config/database";
import routes from "./routes/routes";
import configPassport from "./config/passport";
import passport from "passport";
import { resolvedDirname } from "./utils/dirname";
import expressMySqlSession from "express-mysql-session";

process.chdir(resolvedDirname);

const app = express();
configDotenv();

const MySQLStore = expressMySqlSession(session);
const sessionStore = new MySQLStore(dbOptions);

if (process.env.NODE_ENV !== "development") {
    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                success: false,
                code: 429,
                title: "Too many requests",
                feedback:
                    "Too many requests were made, please wait and try again",
                errorCode: "tooManyRequests",
            },
        })
    );
}

const sessionOptions = {
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 300000 },
    store: sessionStore,
};

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sessionOptions.cookie.secure = true; // serve secure cookies
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

configPassport();

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(process.env.API_PORT);

if (process.env.NODE_ENV === "development") {
    console.log(`Express server now running on port ${process.env.API_PORT}`);
}
