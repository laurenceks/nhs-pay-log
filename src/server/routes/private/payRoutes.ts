import { Router } from "express";
import { getPay, getPaySlip } from "../../controllers/payController";
import { validateRequest } from "../../middleware/validateRequest";
import { z } from "zod";
import { logShiftValidationSchema } from "../../../shared/validationSchemas/logShiftValidationSchema";

const router = Router();

router.get("/", getPay);
router.get(
    "/:employmentId/:payMonth",
    validateRequest(
        z.object({
            employmentId: logShiftValidationSchema.shape.employment_id,
            payMonth: logShiftValidationSchema.shape.pay_month,
        }),
        "params"
    ),
    getPaySlip
);

export default router;
