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
import { validateRequest } from "../../middleware/validateRequest";
import { forgotValidationSchema } from "../../../shared/validationSchemas/forgotValidationSchema";
import { registerValidationSchema } from "../../../shared/validationSchemas/registerValidationSchema";
import { loginValidationSchema } from "../../../shared/validationSchemas/loginValidationSchema";

const router = Router();

router.get("/register", getRegisterOptions);
router.post(
    "/register",
    validateRequest(registerValidationSchema),
    postRegister
);
router.get("/login", authenticateRequest, checkLoginStatus);
router.post("/login", validateRequest(loginValidationSchema), login);
router.get("/logout", logout);
router.get("/verify", validateToken, getVerify);
router.post(
    "/verify",
    validateRequest(forgotValidationSchema.pick({ email: true })),
    postVerify
);
router.post(
    "/forgot",
    validateRequest(forgotValidationSchema.pick({ email: true })),
    postForgot
);
router.patch(
    "/forgot",
    validateToken,
    validateRequest(forgotValidationSchema),
    patchForgot
);

export default router;
