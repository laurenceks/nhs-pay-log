import { Contract } from "../../../types/commonTypes";
import { filterOptionsByDate } from "./lookup";

export const updateShiftContract = (
    currentContractId: number | null,
    currentEmploymentId: number | null,
    contracts: Contract[] = [],
    searchDate: string | Date = new Date()
): [boolean, Contract | undefined, Contract[]] => {
    const filteredContractsByDate = filterOptionsByDate<Contract>(
        contracts,
        searchDate
    );

    if (
        currentContractId &&
        filteredContractsByDate.some((x) => x.id === currentContractId)
    ) {
        //current contract is still valid
        return [true, undefined, filteredContractsByDate];
    } else {
        const employmentContractOnDate = filteredContractsByDate.find(
            (x) => x.employment_id === currentEmploymentId
        );
        if (employmentContractOnDate) {
            //a contract exists for current employment on this date
            return [false, employmentContractOnDate, filteredContractsByDate];
        } else if (filteredContractsByDate.length) {
            //no contract for this employment - substitute with first
            // TODO - should this reset the select instead?
            return [false, filteredContractsByDate[0], filteredContractsByDate];
        } else {
            //no contracts on date
            return [false, undefined, []];
        }
    }
};
