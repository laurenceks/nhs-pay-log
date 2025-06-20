import { Router } from "express";
import { sendRes } from "../../utils/sendRes";
import mockLogData from "../../../../tests/data/mockLogData";

const router = Router();

router.get("/", async (_req, res) => {
    await setTimeout(() => true, 1000);
    sendRes(res, {
        title: "Log refreshed",
        feedback: "Log data refreshed",
        data: [...mockLogData],
    });
});
router.get("/:shiftId", async (req, res) => {
    await setTimeout(() => true, 1000);
    sendRes(res, {
        title: "Shift refreshed",
        feedback: "Shift data refreshed",
        data: { ...mockLogData.find((x) => x.id === req.params.shiftId) },
    });
});

export default router;
