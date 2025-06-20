import { Router } from "express";
import publicRoutes from "./public/publicRoutes";
import privateRoutes from "./private/privateRoutes";
import authenticateRequest from "../middleware/authenticateRequest";

const router = Router();

router.use("/api/v1/public", publicRoutes);
router.use("/api/v1/private", authenticateRequest, privateRoutes);

export default router;
