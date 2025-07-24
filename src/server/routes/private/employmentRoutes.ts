import { Router } from "express";
import {
    getEmployments,
    patchEmployment,
} from "../../controllers/employmentController";
import { validateRequest } from "../../middleware/validateRequest";
import { apiEmploymentValidationSchema } from "../../../shared/validationSchemas/employmentValidationSchema";
import { rowIdValidationSchema } from "../../../shared/validationSchemas/commonValidationSchemas";
import { readContractsByUserIdAndNotEmploymentId } from "../../crud/contractCrud";
import { z } from "zod";

const router = Router();

router.get("/", getEmployments);
router.patch(
    "/:employmentId",
    validateRequest(
        z.object({ employmentId: rowIdValidationSchema("Employment ID") }),
        "params"
    ),
    async (req, res, next) => {
        await validateRequest(
            apiEmploymentValidationSchema(
                await readContractsByUserIdAndNotEmploymentId(
                    req.authenticatedUser.id,
                    req.params.employmentId
                )
            )
        )(req, res, next);
    },
    patchEmployment
);

export default router;
