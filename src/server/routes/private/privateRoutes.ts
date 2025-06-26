import { Router } from "express";
import logRoutes from "./logRoutes";
import employmentRoutes from "./employmentRoutes";

const router = Router();

router.use("/log", logRoutes);
router.use("/employment", employmentRoutes);

export default router;
