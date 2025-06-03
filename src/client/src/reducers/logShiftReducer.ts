import { LogShift, Overruns, ShiftTypes } from "../../../../types/commonTypes";
import { makeToAlwaysLater } from "../../../shared/utils/conversions.ts";
import { formatDate } from "../../../shared/utils/formatDates.ts";
import mockExtrasLookup from "../../../../tests/data/mockExtrasLookup.ts";

export type LogShiftReducerOptions =
    | {
          action:
              | "date"
              | "start"
              | "plannedEnd"
              | "plannedEndBlur"
              | "actualEnd"
              | "employment_id";
          payload: string;
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
          action: "extras";
          payload: typeof mockExtrasLookup;
          // setNewToasts: (newToasts: NotificationToastType[]) => void;
      }
    | {
          action: "set";
          payload: LogShift;
          // setNewToasts: undefined;
      }
    | {
          action: "clear";
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
            if (payload && prevState.start) {
                const newFrom = makeFromTimestamp(payload, prevState.start);
                if (prevState.planned_end) {
                    return {
                        ...prevState,
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
                        date: payload,
                        from: newFrom,
                    };
                }
            } else {
                return {
                    ...prevState,
                    date: payload,
                };
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
        case "extras": {
            return {
                ...prevState,
                extras: [...payload.map((x) => x.id)],
            };
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
