import {
    Contract,
    EmploymentReducerContractKeys,
} from "../../../../types/commonTypes";
import {
    addDaysToTimestamp,
    formatDate,
} from "../../../shared/utils/formatDates";
import { calculatePersonalAllowance } from "@saving-tool/hmrc-income-tax";
import { filterOptionsByDate } from "../../../shared/utils/lookup";
import { queryClient } from "../App";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { roundTo } from "round-to";
import allowFirstFromAndLastTo from "./allowFirstFromAndLastTo";

const defaultContract = (
    employmentId: Contract["employment_id"],
    employmentName: Contract["employment_name"]
): Contract => ({
    from: null,
    to: null,
    employment_id: employmentId,
    employment_name: employmentName,
    pay_group_id: filterOptionsByDate(
        queryClient.getQueryData(["payBands"]),
        new Date()
    )[0],
    pension_perc: 0,
    personal_allowance: calculatePersonalAllowance({
        taxableAnnualIncome: 0,
    }),
    weekly_hours: 37.5,
    student_loan: null,
    hca_perc: 0,
    hca_group_id: null,
    id: Date.now(),
});

export type EmploymentReducerOptions =
    | {
          action: "addContract";
          payload: {
              employmentId: Contract["employment_id"];
              employmentName: Contract["employment_name"];
          };
      }
    | {
          action: "deleteContract" | "moveContract";
          payload: {
              currentContractId: Contract["id"];
              employmentId: Contract["employment_id"];
              employmentName: Contract["employment_name"];
              direction: -1 | 1; //-1 move back or replace with previous, 1 move forward or replace with next
          };
      }
    | {
          action: "from" | "to";
          payload: {
              currentContractId: Contract["id"];
              employmentId: Contract["employment_id"];
              employmentName: Contract["employment_name"];
              newDate: string | null;
          };
      }
    | {
          action: EmploymentReducerContractKeys;
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
          action: "reset";
          payload: Contract[];
      };

const employmentReducer = (
    prevState: Contract[],
    { action, payload }: EmploymentReducerOptions
) => {
    switch (action) {
        case "addContract": {
            const previousContract = prevState[prevState.length - 1];
            if (previousContract) {
                let newTo = previousContract.to
                    ? new Date(previousContract.to)
                    : addDaysToTimestamp(new Date(), -1);
                if (previousContract.from) {
                    const prevFrom = new Date(previousContract.from);
                    if (prevFrom >= newTo) {
                        newTo = addDaysToTimestamp(
                            previousContract.to || prevFrom,
                            1
                        );
                    }
                }
                return [
                    ...prevState.slice(0, -1),
                    {
                        ...previousContract,
                        to: formatDate(newTo, "yyyy-mm-dd"),
                    },
                    {
                        ...previousContract,
                        from: formatDate(
                            addDaysToTimestamp(newTo, 1),
                            "yyyy-mm-dd"
                        ),
                        to: null,
                        id: Date.now() + Math.floor(Math.random() * 1000000000),
                    },
                ];
            } else {
                return [
                    defaultContract(
                        payload.employmentId,
                        payload.employmentName
                    ),
                ];
            }
        }
        case "deleteContract": {
            if (prevState.length === 0) {
                //should not be possible but in case there are no contracts add the default
                toast.error("Employments must have at least one contract", {
                    id: `${payload.employmentId}-delete-minOneContract`,
                });
                return [
                    defaultContract(
                        payload.employmentId,
                        payload.employmentName
                    ),
                ];
            } else if (prevState.length === 1) {
                //should not be possible - only one contract
                toast.error("An employment must have at least one contract", {
                    id: `${payload.employmentId}-delete-onlyOne`,
                });
                return prevState;
            } else {
                const currentIndex = prevState.findIndex(
                    (x) => x.id === payload.currentContractId
                );
                const currentContract = prevState[currentIndex];
                if (payload.direction === -1) {
                    //replace with previous
                    if (currentIndex === 0) {
                        //should also not be possible - first contract being deleted and replaced with previous
                        toast.error("No previous contract to replace with", {
                            id: `${payload.employmentId}-delete-noPrevious`,
                        });
                        return prevState;
                    } else {
                        const previousContract = prevState[currentIndex - 1];
                        return [
                            ...prevState.slice(
                                0,
                                Math.max(currentIndex - 1, 0)
                            ),
                            {
                                ...previousContract,
                                to: currentContract.to,
                            },
                            ...prevState.slice(currentIndex + 1),
                        ];
                    }
                } else {
                    //replace with next
                    if (currentIndex === prevState.length - 1) {
                        //should not be possible - last contract being replaced with next
                        toast.error("No next contract to replace with", {
                            id: `${payload.employmentId}-delete-noNext`,
                        });
                        return prevState;
                    } else {
                        const nextContract = prevState[currentIndex + 1];
                        return [
                            ...prevState.slice(0, Math.max(currentIndex, 0)),
                            {
                                ...nextContract,
                                from: currentContract.from,
                            },
                            ...prevState.slice(currentIndex + 2),
                        ];
                    }
                }
            }
        }
        case "moveContract": {
            if (prevState.length === 0) {
                //should not be possible - employment has no contracts
                //should not be possible but in case there are no contracts add the default
                toast.error("Employments must have at least one contract", {
                    id: `${payload.employmentId}-move-minOneContract`,
                });
                return [
                    defaultContract(
                        payload.employmentId,
                        payload.employmentName
                    ),
                ];
            } else if (prevState.length === 1) {
                //should not be possible - only one contract to move
                toast.error("A sole contract cannot be moved", {
                    id: `${payload.employmentId}-move-onlyOne`,
                });
                return prevState;
            } else {
                const currentIndex = prevState.findIndex(
                    (x) => x.id === payload.currentContractId
                );
                const currentContract = prevState[currentIndex];
                if (payload.direction === -1) {
                    //move backwards
                    if (currentIndex === 0) {
                        //should not be possible - moving first contract backwards
                        toast.error(
                            "The first contract can't be moved backwards",
                            {
                                id: `${payload.employmentId}-move-firstBackwards`,
                            }
                        );
                        return prevState;
                    } else {
                        const previousContract = prevState[currentIndex - 1];
                        return [
                            ...prevState.slice(
                                0,
                                Math.max(currentIndex - 1, 0)
                            ),
                            {
                                ...currentContract,
                                from: previousContract.from,
                                to: previousContract.to,
                            },
                            {
                                ...previousContract,
                                from: currentContract.from,
                                to: currentContract.to,
                            },
                            ...prevState.slice(currentIndex + 1),
                        ];
                    }
                } else {
                    if (currentIndex === prevState.length - 1) {
                        //should not be possible - moving last contract forwards
                        toast.error(
                            "The last contract can't be moved forwards",
                            {
                                id: `${payload.employmentId}-move-lastForwards`,
                            }
                        );
                        return prevState;
                    } else {
                        const nextContract = prevState[currentIndex + 1];
                        return [
                            ...prevState.slice(0, Math.max(currentIndex, 0)),
                            {
                                ...nextContract,
                                from: currentContract.from,
                                to: currentContract.to,
                            },
                            {
                                ...currentContract,
                                from: nextContract.from,
                                to: nextContract.to,
                            },
                            ...prevState.slice(currentIndex + 2),
                        ];
                    }
                }
            }
        }
        case "from": {
            const { allowFirstFrom, allowLastTo } = allowFirstFromAndLastTo(
                payload.employmentId
            );
            const currentIndex = prevState.findIndex(
                (x) => x.id === payload.currentContractId
            );

            if (prevState.length === 0) {
                //should not be possible but in case there are no contracts add the default
                toast.error("Employments must have at least one contract", {
                    id: `${payload.employmentId}-from-minOneContract`,
                });
                return [
                    defaultContract(
                        payload.employmentId,
                        payload.employmentName
                    ),
                ];
            } else if (
                prevState.length === 1 &&
                !allowFirstFrom &&
                !allowLastTo
            ) {
                //also should not be possible but if only one contract, ensure from and to are null
                toast.error("From and to cannot be set on a sole contract", {
                    id: `${payload.employmentId}-from-onlyOneContract`,
                });
                return [{ ...prevState[0], from: null, to: null }];
            } else if (
                payload.newDate &&
                dayjs(payload.newDate, "yyyy-mm-dd").isValid()
            ) {
                const currentContract = prevState[currentIndex];
                const previousContract = prevState[currentIndex - 1];

                if (currentIndex === 0 && !allowFirstFrom) {
                    //should not be possible, if first contract ensure from is null
                    toast.error("From cannot be set on the first contract", {
                        id: `${payload.employmentId}-from-firstContract`,
                    });
                    return [
                        { ...prevState[0], from: null },
                        ...prevState.slice(1),
                    ];
                } else {
                    if (
                        currentIndex === prevState.length - 1 &&
                        currentContract.to &&
                        !allowLastTo
                    ) {
                        toast("To cannot be set on the last contract", {
                            id: `${payload.employmentId}-from-lastContract`,
                        });
                    }
                    let newFrom = payload.newDate;
                    const minFrom = previousContract?.from
                        ? formatDate(
                              addDaysToTimestamp(
                                  previousContract.from as string,
                                  2
                              ),
                              "yyyy-mm-dd"
                          )
                        : null;
                    if (minFrom && newFrom <= minFrom) {
                        toast.error(
                            "From cannot be on or before the day after the previous contract's from",
                            {
                                id: `${payload.employmentId}-from-fromBeforePreviousFrom`,
                            }
                        );
                        newFrom = formatDate(minFrom, "yyyy-mm-dd");
                    }

                    if (currentContract?.to && newFrom >= currentContract.to) {
                        toast.error("From cannot be after to", {
                            id: `${payload.employmentId}-from-fromAfterThanTo`,
                        });
                        newFrom = formatDate(
                            addDaysToTimestamp(currentContract.to, -1),
                            "yyyy-mm-dd"
                        );
                    }

                    return [
                        ...prevState.slice(0, Math.max(currentIndex - 1, 0)),
                        ...(previousContract
                            ? [
                                  {
                                      ...previousContract,
                                      to: formatDate(
                                          addDaysToTimestamp(newFrom, -1),
                                          "yyyy-mm-dd"
                                      ),
                                  },
                              ]
                            : []),
                        {
                            ...currentContract,
                            from: newFrom,
                            to:
                                currentIndex === prevState.length - 1 &&
                                !allowLastTo
                                    ? null
                                    : currentContract.to,
                        },
                        ...prevState.slice(currentIndex + 1),
                    ];
                }
            } else if (currentIndex == 0 && !payload.newDate) {
                return prevState.map((x) =>
                    x.id === payload.currentContractId
                        ? { ...x, from: null }
                        : x
                );
            } else {
                //invalid new date
                toast.error(`Invalid date`, {
                    id: `${payload.employmentId}-from-invalidDate`,
                });
                return prevState;
            }
        }
        case "to": {
            const { allowFirstFrom, allowLastTo } = allowFirstFromAndLastTo(
                payload.employmentId
            );
            const currentIndex = prevState.findIndex(
                (x) => x.id === payload.currentContractId
            );
            if (prevState.length === 0) {
                //should not be possible but in case there are no contracts add the default
                toast.error("Employments must have at least one contract", {
                    id: `${payload.employmentId}-to-minOneContract`,
                });
                return [
                    defaultContract(
                        payload.employmentId,
                        payload.employmentName
                    ),
                ];
            } else if (
                prevState.length === 1 &&
                !allowFirstFrom &&
                !allowLastTo
            ) {
                //also should not be possible but if only one contract, ensure from and to are null
                toast.error("From and to cannot be set on a sole contract", {
                    id: `${payload.employmentId}-to-onlyOneContract`,
                });
                return [{ ...prevState[0], from: null, to: null }];
            } else if (
                payload.newDate &&
                dayjs(payload.newDate, "yyyy-mm-dd").isValid()
            ) {
                const currentContract = prevState[currentIndex];
                const nextContract = prevState[currentIndex + 1];

                if (currentIndex === prevState.length - 1 && !allowLastTo) {
                    //should not be possible, if last contract ensure to is null
                    toast.error("To cannot be set on the last contract", {
                        id: `${payload.employmentId}-to-lastContract`,
                    });
                    return [
                        ...prevState.slice(0, -1),
                        { ...currentContract, to: null },
                    ];
                } else {
                    if (
                        currentIndex === 0 &&
                        currentContract.from &&
                        !allowFirstFrom
                    ) {
                        toast("From cannot be set on the first contract");
                    }
                    let newTo = payload.newDate;
                    const maxTo = nextContract?.to
                        ? formatDate(
                              addDaysToTimestamp(nextContract.to as string, -2),
                              "yyyy-mm-dd"
                          )
                        : null;
                    if (maxTo && newTo >= maxTo) {
                        toast.error(
                            "To cannot be on or after the day before next contract's to",
                            {
                                id: `${payload.employmentId}-from-fromAfterNextTo`,
                            }
                        );
                        newTo = maxTo;
                    }

                    if (
                        currentContract?.from &&
                        newTo <= currentContract.from
                    ) {
                        toast.error("To cannot be before from", {
                            id: `${payload.employmentId}-from-toBeforeFrom`,
                        });
                        newTo = formatDate(
                            addDaysToTimestamp(currentContract.from, 1),
                            "yyyy-mm-dd"
                        );
                    }
                    return [
                        ...prevState.slice(0, currentIndex),
                        {
                            ...currentContract,
                            to: newTo,
                            from:
                                currentIndex === 0 && !allowFirstFrom
                                    ? null
                                    : currentContract.from,
                        },
                        ...(nextContract
                            ? [
                                  {
                                      ...nextContract,
                                      from: formatDate(
                                          addDaysToTimestamp(newTo, 1),
                                          "yyyy-mm-dd"
                                      ),
                                  },
                              ]
                            : []),
                        ...prevState.slice(currentIndex + 2),
                    ];
                }
            } else if (
                currentIndex === prevState.length - 1 &&
                !payload.newDate
            ) {
                console.log("341");
                return prevState.map((x) =>
                    x.id === payload.currentContractId ? { ...x, to: null } : x
                );
            } else {
                //invalid new date
                toast.error(`Invalid date`, {
                    id: `${payload.employmentId}-to-invalidDate`,
                });
                return prevState;
            }
        }
        case "pay_group_id":
        case "hca_group_id":
        case "weekly_hours":
        case "pension_perc":
        case "personal_allowance":
        case "student_loan": {
            const currentIndex = prevState.findIndex(
                (x) => x.id === payload.currentContractId
            );
            return [
                ...prevState.slice(0, Math.max(currentIndex, 0)),
                {
                    ...prevState[currentIndex],
                    [action]:
                        action === "pension_perc"
                            ? roundTo((payload.newValue as number) / 100, 4)
                            : payload.newValue,
                },
                ...prevState.slice(currentIndex + 1),
            ];
        }
        case "reset": {
            return payload;
        }
        case undefined:
        case null:
        default: {
            return prevState;
        }
    }
};

export default employmentReducer;
