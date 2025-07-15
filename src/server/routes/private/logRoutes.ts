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
    logShiftIdValidationSchema,
    logShiftValidationSchema,
} from "../../../shared/validationSchemas/logShiftValidationSchema";

const router = Router();

router.get("/", getLog);
router.post(
    "/",
    validateRequest(logShiftValidationSchema, "body"),
    postLogShift
);

router.get(
    "/:shiftId",
    validateRequest(logShiftIdValidationSchema, "params"),
    getLogShift
);
router.patch(
    "/:shiftId",
    validateRequest(logShiftIdValidationSchema, "params"),
    validateRequest(logShiftValidationSchema, "body"),
    patchLogShift
);
router.delete(
    "/:shiftId",
    validateRequest(logShiftIdValidationSchema, "params"),
    deleteLogShift
);

export default router;
