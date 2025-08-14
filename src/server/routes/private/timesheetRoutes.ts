import { Router } from "express";
import {
    getTimesheet,
    getTimesheetList,
} from "../../controllers/timesheetController";
import { validateRequest } from "../../middleware/validateRequest";
import { logShiftValidationSchema } from "../../../shared/validationSchemas/logShiftValidationSchema";
import { z } from "zod";

const router = Router();

router.get("/", getTimesheetList);
router.get(
    "/:employmentId/:timesheetMonth",
    validateRequest(
        z.object({
            employmentId: logShiftValidationSchema.shape.employment_id,
            timesheetMonth: logShiftValidationSchema.shape.pay_month,
        }),
        "params"
    ),
    getTimesheet
);

export default router;
