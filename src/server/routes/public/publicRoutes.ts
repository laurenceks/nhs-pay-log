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

const router = Router();

router.get("/register", getRegisterOptions);
router.post("/register", postRegister);
router.get("/login", authenticateRequest, checkLoginStatus);
router.post("/login", login);
router.get("/verify", validateToken, getVerify);
router.post("/verify", postVerify);
router.post("/forgot", postForgot);
router.patch("/forgot", validateToken, patchForgot);

export default router;
