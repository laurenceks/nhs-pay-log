import { Router } from "express";
import { getEmployments } from "../../controllers/employmentsController";

const router = Router();

router.get("/", getEmployments);

export default router;
