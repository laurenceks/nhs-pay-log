import { Contract, Overruns } from "../../../../types/commonTypes";
import {
    addDaysToTimestamp,
    formatDate,
} from "../../../shared/utils/formatDates";
import { Employment, PayBandTable } from "../../../../types/lookupTypes";
import { calculatePersonalAllowance } from "@saving-tool/hmrc-income-tax";

export type EmploymentReducerOptions =
    | {
          action: "addContract";
          payload: { employment: Employment; filteredPayBands: PayBandTable };
      }
    | {
          action: "from" | "to";
          payload: {
              currentContractId: Contract["id"];
              newDate: string | null;
          };
      }
    | {
          action:
              | "payBand"
              | "hca"
              | "weeklyHours"
              | "pensionPerc"
              | "personalAllowance"
              | "studentLoan";
          payload: {
              currentContractId: Contract["id"];
              newValue:
                  | string
                  | number
                  | Contract["student_loan"]
                  | Contract["hca_group_id"];
          };
      }
    | {
          action: "overrunType";
          payload: Overruns;
      };

const employmentReducer = (
    prevState: Contract[],
    { action, payload }: EmploymentReducerOptions
) => {
    switch (action) {
        case "addContract": {
            const previousContract = prevState[prevState.length - 1];
            if (previousContract) {
                return [
                    ...prevState.slice(0, -1),
                    {
                        ...previousContract,
                        to: formatDate(
                            addDaysToTimestamp(new Date(), -1),
                            "yyyy-mm-dd"
                        ),
                    },
                    {
                        ...previousContract,
                        from: formatDate(new Date(), "yyyy-mm-dd"),
                        to: null,
                        id: 0,
                    },
                ];
            } else {
                return [
                    {
                        from: null,
                        to: null,
                        employment_id: payload.employment.id,
                        employment_name: payload.employment.name,
                        pay_group_id: payload.filteredPayBands[0].group_id,
                        pension_perc: 0,
                        personal_allowance: calculatePersonalAllowance({
                            taxableAnnualIncome: 0,
                        }),
                        weekly_hours: 37.5,
                        student_loan: null,
                        hca_perc: 0,
                        hca_group_id: null,
                        id: 0,
                    },
                ];
            }
        }
        case "from": {
            return prevState.map((x) => {
                if (x.id === payload.currentContractId) {
                    return { ...x, from: payload.newDate };
                } else {
                    return x;
                }
            });
        }
        case "to": {
            return prevState.map((x) => {
                if (x.id === payload.currentContractId) {
                    return { ...x, to: payload.newDate };
                } else {
                    return x;
                }
            });
        }
        case undefined:
        case null:
        default: {
            return prevState;
        }
    }
};

export default employmentReducer;
