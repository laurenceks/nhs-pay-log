import { Router } from "express";
import { getPay } from "../../controllers/payController";

const router = Router();

router.get("/", getPay);

export default router;
