import {
    Employment,
    LogShift,
    Overruns,
    ShiftTypes,
} from "../../../../types/commonTypes";
import { makeToAlwaysLater } from "../../../shared/utils/conversions";
import { formatDate } from "../../../shared/utils/formatDates";
import mockExtrasLookup from "../../../../tests/data/mockExtrasLookup";
import {
    financialYear,
    nextPayDate,
} from "../../../shared/calculations/payDates";
import { filterOptionsByDate } from "../../../shared/utils/lookup";
import mockEmploymentTable from "../../../../tests/data/mockEmploymentTable";

export type LogShiftReducerOptions =
    | {
          action:
              | "date"
              | "start"
              | "plannedEnd"
              | "plannedEndBlur"
              | "actualEnd"
              | "payIdOverride";
          payload: string;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "employment";
          payload: Employment | undefined;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "employment_id";
          payload: number;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "type";
          payload: ShiftTypes;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "overrunType";
          payload: Overruns;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "addExtra";
          payload: typeof mockExtrasLookup;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "removeExtra";
          payload: string;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "set";
          payload: LogShift;
          // setNewToasts: undefined;
      }
    | {
          action: "clear" | "copy";
          payload?: never;
          // setNewToasts: undefined;
      }
    | {
          // default case in switch
          action: undefined | null;
          payload: LogShift | null;
          // setNewToasts: undefined;
      };

export type LogShiftReducer = (
    prevState: LogShift | null,
    options: LogShiftReducerOptions
) => LogShift | null;

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
    prevState: LogShift,
    { action, payload }: LogShiftReducerOptions
) => {
    switch (action) {
        //TODO on date change filter out extras that didn't exist on those dates/had a different value
        case "date": {
            if (payload) {
                const payDate = nextPayDate(payload);
                const payDates = {
                    pay_date: formatDate(payDate, "yyyy-mm-dd"),
                    pay_month: formatDate(payDate, "yy-mm"),
                    pay_financial_year: financialYear(payDate),
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
        case "employment": {
            return {
                ...prevState,
                employment_id: payload?.id || 0,
                employment_name: payload?.name || "",
            };
        }
        case "employment_id": {
            return {
                ...prevState,
                employment_id: payload,
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
        case "payIdOverride": {
            return {
                ...prevState,
                pay_id_override: payload || null,
            };
        }
        case "addExtra": {
            return {
                ...prevState,
                extras: [...payload.map((x) => x.id)],
            };
        }
        case "removeExtra": {
            return {
                ...prevState,
                extras: prevState.extras.filter((x) => x !== payload),
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
                const employmentSelectOptions = filterOptionsByDate<
                    (typeof mockEmploymentTable)[0]
                >(mockEmploymentTable, today);
                const employment: { id: number; name: string } =
                    employmentSelectOptions.some(
                        (x) => x.id === prevState.employment_id
                    )
                        ? {
                              id: prevState.employment_id,
                              name: prevState.employment_name,
                          }
                        : employmentSelectOptions[0];
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
                    employment_id: employment.id || 0,
                    employment_name: employment.name || "",
                };
            } else {
                return {
                    ...prevState,
                };
            }
        }
        /*case "clear": {
            return null;
        }
        case "set": {
            return payload;
        }*/
        case undefined:
        case null:
        default: {
            return prevState;
        }
    }
};

export default logShiftReducer;
