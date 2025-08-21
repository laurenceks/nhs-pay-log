import { readHoursByUserAndEmploymentId } from "../crud/hoursCrud";
import { sendRes } from "../utils/sendRes";

export const getHours = async (req: Request, res: Response) => {
    const data = await readHoursByUserAndEmploymentId(
        req.authenticatedUser.id,
        req.params.employmentId
    );
    sendRes(res, {
        title: "Hours refreshed",
        message: "Hours data refreshed",
        data: data,
    });
};
