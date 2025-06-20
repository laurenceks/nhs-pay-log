import { Router } from "express";
import logRoutes from "./logRoutes";

const router = Router();

router.use("/log", logRoutes);

export default router;
