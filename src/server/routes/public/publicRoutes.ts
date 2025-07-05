import { Router } from "express";
import {
    getRegisterOptions,
    postRegister,
} from "../../controllers/registerController";
import { checkLoginStatus, login } from "../../controllers/loginController";
import authenticateRequest from "../../middleware/authenticateRequest";
import { getVerify } from "../../controllers/verifyController";

const router = Router();

router.get("/register", getRegisterOptions);
router.post("/register", postRegister);
router.get("/login", authenticateRequest, checkLoginStatus);
router.post("/login", login);
router.get("/verify", getVerify);

export default router;
