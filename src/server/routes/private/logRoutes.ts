import { Router } from "express";
import {
    deleteLogShift,
    getLog,
    getLogShift,
    patchLogShift,
    postLogShift,
} from "../../controllers/logController";

const router = Router();

router.get("/", getLog);
router.post("/", postLogShift);

router.get("/:shiftId", getLogShift);
router.patch("/:shiftId", patchLogShift);
router.delete("/:shiftId", deleteLogShift);

export default router;
