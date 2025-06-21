import { configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { dirname } from "dirname-filename-esm";
import { dbOptions } from "./config/database";
import routes from "./routes/routes";
import configPassport from "./config/passport";
import passport from "passport";

const __dirname = dirname(import.meta);

process.chdir(__dirname);

const app = express();
configDotenv();

async function createMySQLStore() {
    const connectMySQL = await import("express-mysql-session");
    const MySQLStore = connectMySQL.default(session);

    return new MySQLStore(dbOptions);
}

const sessionStore = await createMySQLStore();

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

app.listen(5000);

if (process.env.NODE_ENV === "development") {
    console.log("Express server now running on port 5000");
}
