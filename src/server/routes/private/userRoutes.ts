import { Router } from "express";
import { patchUser } from "../../controllers/userController";

const router = Router();

router.patch("/", patchUser);

export default router;
