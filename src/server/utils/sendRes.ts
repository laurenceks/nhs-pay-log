import { Response } from "express";
import {
    ApiResponse,
    ErrorResponseKey,
    SendResOptions,
} from "../../../types/responseTypes";

const sendRes = <T extends object | null>(
    res: Response,
    options: SendResOptions<T> = { isError: false }
) => {
    const code = options.code || (options.isError ? 500 : 200);
    const isError = code.toString().charAt(0) !== "2";
    const responseJson: ApiResponse<T> = {
        success: !isError,
        message:
            options.message ||
            (isError ? "An unknown error occurred" : "Operation successful"),
        title: options.title || (isError ? "Error" : "Success"),
    };
    if (options.data) {
        responseJson.data = options.data;
    }
    if (isError) {
        responseJson.errorCode = options.errorCode || "unknownError";
    }
    res.status(code).json(responseJson);
};

const sendErrorRes = (
    res: Response,
    type: ErrorResponseKey | null = null,
    feedbackArgs?: { [key: string]: string | number }
) => {
    const types: {
        [key: string]: Omit<SendResOptions<null>, "isError" | "errorCode">;
    } = {
        userAlreadyRegistered: {
            code: 400,
            message: `A user with the email address ${feedbackArgs?.email} is already registered`,
            title: "User already exists",
        },
        userAlreadyVerified: {
            code: 400,
            message: "User already verified",
        },
        noTokenOrSelector: {
            code: 400,
            message: "No token/selector passed",
        },
        invalidToken: {
            code: 400,
            message: "The token passed is not valid",
            title: "Invalid token",
        },
        expiredToken: {
            code: 400,
            message: "The token passed has expired and is no longer valid",
            title: "Expired token",
        },
        targetUserNotFound: {
            code: 400,
            message: "A user with those credentials could not be found",
            title: "Target user not found",
        },
        targetUserUnverified: {
            code: 400,
            message: `${feedbackArgs?.name} has not verified their account`,
            title: "User suspended",
        },
        passwordsDontMatch: {
            code: 400,
            message: "The two passwords provided do not match",
            title: "Passwords don't match",
        },
        noneModified: {
            code: 400,
            message: `${feedbackArgs?.name} could not be updated - it may have been deleted`,
            title: `Unable to update`,
        },
        unauthorised: {
            code: 401,
            message: "You are not logged in",
        },
        userNotFound: {
            code: 401,
            message: "A user with those credentials could not be found",
            title: "User not found",
        },
        invalidUsernameOrPassword: {
            code: 401,
            message: "Invalid username/password",
        },
        userNotVerified: {
            code: 403,
            message:
                "Your account has not been verified; please follow the instructions in the account verification email you received when you registered",
            title: "User not verified",
        },
        userNotAdmin: {
            code: 403,
            message: "You must have admin rights to make this request",
            title: "Insufficient privileges",
        },
        userNotSuperAdmin: {
            code: 403,
            message: "You must have super admin rights to make this request",
            title: "Insufficient privileges",
        },
        targetIsSuperAdmin: {
            code: 403,
            message: "A super admin can only renounce their own rights",
            title: "Insufficient privileges",
        },
        emailError: {
            code: 500,
            message: "There was an error sending an email",
            title: "Email error",
        },
        validationError: {
            code: 422,
            message:
                (feedbackArgs?.message as string) ||
                "A value passed is not valid",
            title: "Invalid value passed",
        },
    };
    const errorType: SendResOptions<null> =
        type && types[type]
            ? { ...types[type], errorCode: type }
            : {
                  code: 500,
                  isError: true,
                  errorCode: feedbackArgs?.errorCode,
                  title: feedbackArgs?.title,
                  message: feedbackArgs?.message,
              };
    sendRes(res, errorType);
};

export { sendErrorRes, sendRes };
