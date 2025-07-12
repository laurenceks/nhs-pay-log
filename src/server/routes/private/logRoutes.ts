import { Router } from "express";
import {
    deleteLogShift,
    getLog,
    getLogShift,
    patchLogShift,
    postLogShift,
} from "../../controllers/logController";
import { validateRequest } from "../../middleware/validateRequest";
import {
    logShiftValidationSchema,
    newLogShiftValidationSchema,
    rowIdValidationSchema,
} from "../../utils/validationSchemas";

const router = Router();

router.get("/", getLog);
router.post("/", validateRequest(newLogShiftValidationSchema), postLogShift);

router.get("/:shiftId", getLogShift);
router.patch(
    "/:shiftId",
    validateRequest(logShiftValidationSchema),
    patchLogShift
);
router.delete(
    "/:shiftId",
    validateRequest(rowIdValidationSchema("shiftId")),
    deleteLogShift
);

export default router;
