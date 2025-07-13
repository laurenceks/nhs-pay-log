import { Router } from "express";
import {
    getRegisterOptions,
    postRegister,
} from "../../controllers/registerController";
import { checkLoginStatus, login } from "../../controllers/loginController";
import authenticateRequest from "../../middleware/authenticateRequest";
import { getVerify, postVerify } from "../../controllers/verifyController";
import { patchForgot, postForgot } from "../../controllers/forgotController";
import validateToken from "../../middleware/validateToken";
import { logout } from "../../controllers/logoutController";
import {
    forgotValidationSchema,
    loginValidationSchema,
    registerValidationSchema,
} from "../../utils/validationSchemas";
import { validateRequest } from "../../middleware/validateRequest";
import { checkSchema } from "express-validator";

const router = Router();

router.get("/register", getRegisterOptions);
router.post(
    "/register",
    validateRequest(registerValidationSchema),
    postRegister
);
router.get("/login", authenticateRequest, checkLoginStatus);
router.post("/login", checkSchema(loginValidationSchema), login);
router.get("/logout", logout);
router.get("/verify", validateToken, getVerify);
router.post(
    "/verify",
    validateRequest({ email: registerValidationSchema.email }),
    postVerify
);
router.post(
    "/forgot",
    validateRequest({ email: registerValidationSchema.email }),
    postForgot
);
router.patch(
    "/forgot",
    validateToken,
    validateRequest(forgotValidationSchema),
    patchForgot
);

export default router;
