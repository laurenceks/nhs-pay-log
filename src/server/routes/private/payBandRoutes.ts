import { Router } from "express";
import { getPayBands } from "../../controllers/payBandController";

const router = Router();

router.get("/", getPayBands);

export default router;
