import { Contract } from "../../../../types/commonTypes";
import { queryClient } from "../App";
import { ApiResponse } from "../../../../types/responseTypes";

const allowFirstFromAndLastTo = (currentContractId: Contract["id"]) => {
    let allowFirstFrom = false;
    let allowLastTo = false;

    for (const contract of (
        queryClient.getQueryData(["contracts"]) as ApiResponse<Contract[]>
    )?.data ?? []) {
        if (contract.employment_id === currentContractId) continue;

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
