import { Router } from "express";
import registerController from "../../controllers/registerController";
import { checkLoginStatus, login } from "../../controllers/loginController";
import authenticateRequest from "../../middleware/authenticateRequest";

const router = Router();

router.post("/register", registerController);
router.get("/login", authenticateRequest, checkLoginStatus);
router.post("/login", login);

export default router;
