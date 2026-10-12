import { Router } from "express";
import {
    deleteEmployment,
    getEmployments,
    getLeaveOnReliefUshReportByEmploymentId,
    patchEmployment,
    postEmployment,
} from "../../controllers/employmentController";
import { validateRequest } from "../../middleware/validateRequest";
import { apiEmploymentValidationSchema } from "../../../shared/validationSchemas/employmentValidationSchema";
import { rowIdValidationSchema } from "../../../shared/validationSchemas/commonValidationSchemas";
import { readContractsByUserIdAndNotEmploymentId } from "../../crud/contractCrud";
import { z } from "zod";

const router = Router();

router.get("/", getEmployments);
router.get(
    "/:employmentId/report/",
    validateRequest(
        z.object({
            employmentId: rowIdValidationSchema("Employment ID"),
        }),
        "params"
    ),
    getLeaveOnReliefUshReportByEmploymentId
);
router.post("/", postEmployment);
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
router.delete(
    "/:employmentId",
    validateRequest(
        z.object({ employmentId: rowIdValidationSchema("Employment ID") }),
        "params"
    ),
    deleteEmployment
);

export default router;
