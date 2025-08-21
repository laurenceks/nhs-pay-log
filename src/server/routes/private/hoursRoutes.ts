import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { z } from "zod";
import { logShiftValidationSchema } from "../../../shared/validationSchemas/logShiftValidationSchema";
import { getHours } from "../../controllers/hoursController";

const router = Router();

router.get(
    "/:employmentId",
    validateRequest(
        z.object({
            employmentId: logShiftValidationSchema.shape.employment_id,
        }),
        "params"
    ),
    getHours
);

export default router;
