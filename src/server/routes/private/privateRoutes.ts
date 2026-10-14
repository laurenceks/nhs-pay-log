import { Router } from "express";
import logRoutes from "./logRoutes";
import employmentRoutes from "./employmentRoutes";
import contractRoutes from "./contractRoutes";
import extraRoutes from "./extraRoutes";
import payBandRoutes from "./payBandRoutes";
import payRoutes from "./payRoutes";
import timesheetRoutes from "./timesheetRoutes";
import hoursRoutes from "./hoursRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/log", logRoutes);
router.use("/pay", payRoutes);
router.use("/timesheet", timesheetRoutes);
router.use("/hours", hoursRoutes);
router.use("/employment", employmentRoutes);
router.use("/contract", contractRoutes);
router.use("/extra", extraRoutes);
router.use("/payBands", payBandRoutes);
router.use("/user", userRoutes);

export default router;
