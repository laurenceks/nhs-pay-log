import { LogShift, Overruns, ShiftTypes } from "../../../../types/commonTypes";
import { makeToAlwaysLater } from "../../../shared/conversions.ts";
import { formatDate } from "../../../shared/formatDates.ts";

export type LogShiftReducerOptions =
    | {
          action: "date" | "start" | "plannedEnd" | "actualEnd" | "employment";
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
        plannedTo: formatDate(newPlannedTo, "yyyy-mm-dd hh:mm:ss"),
        actualTo: formatDate(newActualTo, "yyyy-mm-dd hh:mm:ss"),
    };
};
const logShiftReducer = (
    prevState: LogShift,
    { action, payload }: LogShiftReducerOptions
) => {
    switch (action) {
        case "date": {
            const newFrom = `${payload} ${prevState.start}`;
            return {
                ...prevState,
                date: payload,
                from: newFrom,
                ...makeEndTimestamps(
                    payload as string,
                    newFrom,
                    prevState.plannedEnd,
                    prevState.actualEnd
                ),
            };
        }
        case "start": {
            const newFrom = `${prevState.date} ${payload}`;
            return {
                ...prevState,
                date: prevState.date,
                start: payload,
                from: newFrom,
                ...makeEndTimestamps(
                    prevState.date,
                    newFrom,
                    prevState.plannedEnd,
                    prevState.actualEnd
                ),
            };
        }
        case "plannedEnd": {
            return {
                ...prevState,
                plannedEnd: payload,
                ...makeEndTimestamps(
                    prevState.date,
                    prevState.from,
                    payload as string,
                    prevState.actualEnd
                ),
            };
        }
        case "actualEnd": {
            return {
                ...prevState,
                actualEnd: payload,
                ...makeEndTimestamps(
                    prevState.date,
                    prevState.from,
                    prevState.plannedEnd,
                    payload as string
                ),
            };
        }
        case "employment": {
            return {
                ...prevState,
                employment: payload,
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
                overrunType: payload,
            };
        }
        case "clear": {
            return null;
        }
        case "set": {
            return payload;
        }
        case undefined:
        case null:
        default: {
            return prevState;
        }
    }
};

export default logShiftReducer;
