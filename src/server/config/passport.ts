import type { DoneCallback } from "passport";
import passport from "passport";
import {
    type IStrategyOptions,
    Strategy,
    type VerifyFunction,
} from "passport-local";
import validateHash from "../utils/crypto";
import { selectUserByEmail, selectUserById } from "../crud/userCrud";
import { AppUser } from "../../../types/commonTypes";

const configPassport = () => {
    passport.serializeUser((user: AppUser, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        const [user] = await selectUserById(id);
        // pass result whatever it is - middleware function will validate
        done(null, user ? (user as Express.User) : false);
    });

    passport.use(
        new Strategy(
            {
                usernameField: "email",
                passwordField: "password",
            } as IStrategyOptions,
            (async (
                email: string,
                passwordPlainText: string,
                done: DoneCallback
            ) => {
                if (!email || !passwordPlainText) {
                    done("invalidUsernameOrPassword", false);
                }
                try {
                    const [user] = await selectUserByEmail(email);
                    if (
                        !user ||
                        !validateHash(passwordPlainText, user.hash, user.salt)
                    ) {
                        // user was not found, or they deleted their account, or password wrong
                        done("invalidUsernameOrPassword", false);
                    } else {
                        // user exists, loginController is valid, user isn't blacklisted - proceed
                        const {
                            createdAt,
                            updatedAt,
                            deleted,
                            salt,
                            hash,
                            ...reqUser
                        } = user;

                        done(null, {
                            ...reqUser,
                        });
                    }
                } catch (e) {
                    done(e, false);
                }
            }) as VerifyFunction
        )
    );
};

export default configPassport;
