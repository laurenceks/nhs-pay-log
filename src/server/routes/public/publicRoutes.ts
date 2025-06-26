import { Router } from "express";
import {
    getRegisterOptions,
    postRegister,
} from "../../controllers/registerController";
import { checkLoginStatus, login } from "../../controllers/loginController";
import authenticateRequest from "../../middleware/authenticateRequest";

const router = Router();

router.get("/register", getRegisterOptions);
router.post("/register", postRegister);
router.get("/login", authenticateRequest, checkLoginStatus);
router.post("/login", login);

export default router;
