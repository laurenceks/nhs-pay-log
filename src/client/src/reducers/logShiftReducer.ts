import {
    ClientShift,
    Contract,
    Overruns,
    ShiftExtra,
    ShiftTypes,
} from "../../../../types/commonTypes";
import { makeToAlwaysLater } from "../../../shared/utils/conversions";
import { formatDate } from "../../../shared/utils/formatDates";
import {
    financialYear,
    flowersPayMonth,
    nextPayDate,
} from "../../../shared/calculations/payDates";
import { updateShiftContract } from "../../../shared/utils/updateShiftContract";
import { toast } from "react-hot-toast";
import { queryClient } from "../../../shared/queryClient";

export type LogShiftReducerOptions =
    | {
          action:
              | "date"
              | "start"
              | "plannedEnd"
              | "plannedEndBlur"
              | "actualEnd"
              | "payIdOverride"
              | "breakOverride"
              | "notes";
          payload: string;
      }
    | {
          action: "contract";
          payload: Contract | undefined;
      }
    | {
          action: "type";
          payload: ShiftTypes;
      }
    | {
          action: "overrunType";
          payload: Overruns;
      }
    | {
          action: "addExtra";
          payload: ShiftExtra[];
      }
    | {
          action: "removeExtra";
          payload: ShiftExtra["id"];
      }
    | {
          action: "set";
          payload: ClientShift;
      }
    | {
          action: "clear" | "copy";
          payload?: never;
      }
    | {
          // default case in switch
          action: undefined | null;
          payload: ClientShift | null;
      };

const makeFromTimestamp = (date: string, start: string) =>
    formatDate(date + " " + start, "yyyy-mm-dd hh:mm:ss");
const makeEndTimestamps = (
    date: string,
    from: string,
    plannedEnd: string,
    actualEnd: string
) => {
    const newPlannedTo = makeToAlwaysLater(from, `${date} ${plannedEnd}`).toObj;
    const newActualTo = makeToAlwaysLater(
        newPlannedTo,
        `${date} ${actualEnd}`
    ).toObj;

    return {
        planned_to: formatDate(newPlannedTo, "yyyy-mm-dd hh:mm:ss"),
        actual_to: formatDate(newActualTo, "yyyy-mm-dd hh:mm:ss"),
    };
};
const logShiftReducer = (
    prevState: ClientShift,
    { action, payload }: LogShiftReducerOptions
) => {
    switch (action) {
        case "date": {
            if (payload) {
                const payDate = nextPayDate(payload);
                const payDates = {
                    pay_date: formatDate(payDate, "yyyy-mm-dd"),
                    pay_month: formatDate(payDate, "yy-mm"),
                    pay_financial_year: financialYear(payDate),
                    flowers_pay_month: flowersPayMonth(payDate),
                };

                if (payload && prevState.start) {
                    const newFrom = makeFromTimestamp(payload, prevState.start);
                    if (prevState.planned_end) {
                        return {
                            ...prevState,
                            ...payDates,
                            date: payload,
                            from: newFrom,
                            ...makeEndTimestamps(
                                payload as string,
                                newFrom,
                                prevState.planned_end,
                                prevState.actual_end || prevState.planned_end
                            ),
                        };
                    } else {
                        return {
                            ...prevState,
                            ...payDates,
                            date: payload,
                            from: newFrom,
                        };
                    }
                } else {
                    return {
                        ...prevState,
                        ...payDates,
                        date: payload,
                    };
                }
            } else {
                return prevState;
            }
        }
        case "start": {
            if (payload && prevState.date) {
                const newFrom = makeFromTimestamp(prevState.date, payload);
                if (prevState.planned_end) {
                    return {
                        ...prevState,
                        date: prevState.date,
                        start: payload,
                        from: newFrom,
                        ...makeEndTimestamps(
                            prevState.date,
                            newFrom,
                            prevState.planned_end,
                            prevState.actual_end || prevState.planned_end
                        ),
                    };
                } else {
                    return {
                        ...prevState,
                        start: payload,
                        from: newFrom,
                    };
                }
            } else {
                return {
                    ...prevState,
                    start: payload,
                };
            }
        }
        case "plannedEnd": {
            if (prevState.from) {
                return {
                    ...prevState,
                    planned_end: payload,
                    actual_end: prevState.actual_end,
                    ...(prevState.actual_end
                        ? makeEndTimestamps(
                              prevState.date,
                              prevState.from,
                              payload as string,
                              prevState.actual_end || payload
                          )
                        : {}),
                };
            } else {
                return {
                    ...prevState,
                    planned_end: payload,
                };
            }
        }
        case "plannedEndBlur": {
            if (prevState.from) {
                return {
                    ...prevState,
                    planned_end: payload,
                    actual_end: prevState.actual_end || payload,
                    ...makeEndTimestamps(
                        prevState.date,
                        prevState.from,
                        payload as string,
                        prevState.actual_end || payload
                    ),
                };
            } else {
                return {
                    ...prevState,
                    planned_end: payload,
                };
            }
        }
        case "actualEnd": {
            if (prevState.from && prevState.planned_to) {
                return {
                    ...prevState,
                    actual_end: payload,
                    ...makeEndTimestamps(
                        prevState.date,
                        prevState.from,
                        prevState.planned_end,
                        payload as string
                    ),
                };
            } else {
                return {
                    ...prevState,
                    actual_end: payload,
                };
            }
        }
        case "contract": {
            return {
                ...prevState,
                contract_id: payload?.id || 0,
                employment_id: payload?.employment_id || 0,
                weekly_hours: payload?.weekly_hours ?? 37.5,
                half_is_all_ush: payload ? !!payload.half_is_all_ush : true,
                break_from_higher: payload
                    ? !!payload?.break_from_higher
                    : false,
                leave_relief_ush_type: payload?.leave_relief_ush_type || "best",
            };
        }
        case "type": {
            return {
                ...prevState,
                type: payload,
            };
        }
        case "overrunType": {
            return {
                ...prevState,
                overrun_type: payload,
            };
        }
        case "notes": {
            return {
                ...prevState,
                notes: payload,
            };
        }
        case "payIdOverride": {
            return {
                ...prevState,
                pay_id_override: payload || null,
            };
        }
        case "breakOverride": {
            const [hours, minutes] = payload.split(":").map(Number);
            const breakInMs = (hours * 60 + minutes) * 60000;
            return {
                ...prevState,
                break_override_string: payload || null,
                break_override:
                    isNaN(breakInMs) || breakInMs < 0 ? null : breakInMs,
            };
        }
        case "addExtra": {
            return {
                ...prevState,
                selectedExtras: payload,
                extras_ids_string: [...payload.map((x) => x.group_id)].join(
                    ","
                ),
            };
        }
        case "removeExtra": {
            const newSelection =
                prevState.selectedExtras?.filter(
                    (x) => x.group_id !== payload
                ) || [];
            return {
                ...prevState,
                selectedExtras: newSelection,
                extras_ids_string: newSelection
                    .map((x) => x.group_id)
                    .join(","),
            };
        }
        case "copy": {
            if (
                prevState.from &&
                prevState.planned_to &&
                prevState.actual_to &&
                prevState.start &&
                prevState.planned_end &&
                prevState.actual_end
            ) {
                const today = new Date();
                const todayFormatted = formatDate(today, "yyyy-mm-dd");
                const payDate = nextPayDate(today);
                const payDates = {
                    pay_date: formatDate(payDate, "yyyy-mm-dd"),
                    pay_month: formatDate(payDate, "yy-mm"),
                    pay_financial_year: financialYear(payDate),
                };
                const newFrom = makeFromTimestamp(
                    todayFormatted,
                    prevState.start
                );
                const [, newContract] = updateShiftContract(
                    prevState.contract_id,
                    prevState.employment_id,
                    queryClient.getQueryData(["contract"]),
                    prevState.date
                );

                toast.success("Shift copied", {
                    id: `shift-${prevState.id}-copy`,
                });

                return {
                    ...prevState,
                    ...payDates,
                    id: 0,
                    date: todayFormatted,
                    from: newFrom,
                    ...makeEndTimestamps(
                        todayFormatted,
                        newFrom,
                        prevState.planned_end,
                        prevState.actual_end || prevState.planned_end
                    ),
                    contract_id: newContract?.id || prevState.contract_id || 0,
                    employment_id:
                        newContract?.employment_id ||
                        prevState.employment_id ||
                        0,
                    employment_name:
                        newContract?.employment_name ||
                        prevState.employment_name ||
                        "",
                    weekly_hours: newContract?.weekly_hours ?? 37.5,
                    half_is_all_ush: newContract
                        ? !!newContract.half_is_all_ush
                        : true,
                    break_from_higher: newContract
                        ? !!newContract?.break_from_higher
                        : false,
                    leave_relief_ush_type:
                        newContract?.leave_relief_ush_type || "best",
                };
            } else {
                return {
                    ...prevState,
                };
            }
        }
        case undefined:
        case null:
        default: {
            return prevState;
        }
    }
};

export default logShiftReducer;
