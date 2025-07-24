import { queryClient } from "../App";
import { ApiResponse } from "../../../../types/responseTypes";
import { Contract } from "../../../../types/commonTypes";

const allowFirstFromAndLastTo = (
    currentEmploymentId: Contract["employment_id"],
    contracts?: Contract[]
) => {
    let allowFirstFrom = false;
    let allowLastTo = false;

    for (const contract of (contracts ||
        (queryClient.getQueryData(["contracts"]) as ApiResponse<Contract[]>)
            ?.data) ??
        []) {
        if (contract.employment_id === currentEmploymentId) continue;

        if (contract.from === null) {
            allowFirstFrom = true;
        }

        if (contract.to === null) {
            allowLastTo = true;
        }

        if (allowFirstFrom && allowLastTo) break;
    }
    return { allowFirstFrom, allowLastTo };
};
export default allowFirstFromAndLastTo;
