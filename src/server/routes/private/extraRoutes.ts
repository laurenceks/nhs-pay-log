import { Router } from "express";
import { getExtras } from "../../controllers/extraController";

const router = Router();

router.get("/", getExtras);

export default router;
