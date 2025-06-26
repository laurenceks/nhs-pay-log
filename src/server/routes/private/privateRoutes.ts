import { Router } from "express";
import logRoutes from "./logRoutes";
import employmentRoutes from "./employmentRoutes";
import contractRoutes from "./contractRoutes";

const router = Router();

router.use("/log", logRoutes);
router.use("/employment", employmentRoutes);
router.use("/contract", contractRoutes);

export default router;
