import testCumulativeAdditionalHoursData from "../../tests/data/testCumulativeAdditionalHoursData.ts";
import { makeToDateAlwaysLater } from "./conversions.ts";
import {
  calculateShiftHours,
  calculateShiftLength,
  isBankHoliday,
} from "./shiftLengths.ts";

const additionalHoursShiftTypes = ["OT", "TOIL", "Bank"];

export const calculateCumulativeAdditionalHours = (
  from: Date,
  log: {
    date: string;
    start: string;
    plannedEnd: string;
    actualEnd: string;
    type: string;
  }[] = testCumulativeAdditionalHoursData,
) => {
  const prevMonday = new Date(from);
  prevMonday.setHours(0, 0, 0, 0);
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));

  return log.reduce((acc, val) => {
    const valFrom = new Date(`${val.date} ${val.start}`);
    const valTo = makeToDateAlwaysLater(
      valFrom,
      `${val.date} ${val.actualEnd}`,
    ).toDate;
    if (valFrom >= prevMonday && valFrom < from) {
      if (additionalHoursShiftTypes.includes(val.type)) {
        return acc + calculateShiftHours(valFrom, valTo);
      } else {
        return (
          acc +
          calculateShiftHours(
            makeToDateAlwaysLater(valFrom, `${val.date} ${val.plannedEnd}`)
              .toDate,
            valTo,
          )
        );
      }
    }
    return acc;
  }, 0);
};

export const calculateAdditionalHours = (
  {
    date,
    start,
    actualEnd,
    plannedEnd,
    overrunType,
    type,
  }: {
    date: string;
    start: string;
    actualEnd: string;
    plannedEnd: string;
    overrunType: string;
    type: string;
  },
  log: typeof testCumulativeAdditionalHoursData,
) => {
  const isAdditionalHoursShift = additionalHoursShiftTypes.includes(type);
  const { fromDate: from, toDate: to } = makeToDateAlwaysLater(
    `${date} ${isAdditionalHoursShift ? start : plannedEnd}`,
    `${date} ${overrunType === "OT" ? actualEnd : plannedEnd}`,
  );

  const additionalHoursBreakdown = {
    flat: 0,
    timeAndHalf: 0,
    double: 0,
  };

  if (from === to) {
    return additionalHoursBreakdown;
  }

  const cumulativeAdditionalHours = calculateCumulativeAdditionalHours(
    from,
    log,
  );
  const additionalHours = isAdditionalHoursShift
    ? calculateShiftHours(from, to)
    : calculateShiftLength(from, to);

  const { fromDate: overrunFrom, toDate: overrunTo } = makeToDateAlwaysLater(
    `${date} ${plannedEnd}`,
    `${date} ${actualEnd}`,
  );

  const overrunHours =
    overrunFrom === overrunTo
      ? 0
      : calculateShiftLength(
          `${date} ${plannedEnd}`,
          makeToDateAlwaysLater(from, `${date} ${actualEnd}`).toDate,
        );

  if (additionalHours) {
    // TODO make this a lookup (37.5 - weekly contracted hours)
    const weeklyOtThresholdHours = 18.75;

    if (additionalHours + cumulativeAdditionalHours >= weeklyOtThresholdHours) {
      additionalHoursBreakdown.flat = Math.max(
        0,
        weeklyOtThresholdHours - cumulativeAdditionalHours - overrunHours,
      );

      const fromIsBankHoliday = isBankHoliday(from);
      const toIsBankHoliday = isBankHoliday(to);

      //TODO test night shifts
      if (fromIsBankHoliday || toIsBankHoliday) {
        if (fromIsBankHoliday && toIsBankHoliday) {
          additionalHoursBreakdown.double = Math.max(
            0,
            additionalHours - additionalHoursBreakdown.flat,
          );
        } else if (fromIsBankHoliday) {
          //from time until midnight
          additionalHoursBreakdown.double = calculateShiftLength(
            from,
            from.setHours(24, 0, 0, 0),
          );
        } else {
          //midnight until to time
          additionalHoursBreakdown.double = calculateShiftLength(
            from.setHours(24, 0, 0, 0),
            to,
          );
        }
      }

      additionalHoursBreakdown.timeAndHalf = Math.max(
        0,
        additionalHours -
          additionalHoursBreakdown.double -
          additionalHoursBreakdown.flat,
      );
    } else {
      additionalHoursBreakdown.flat = additionalHours;
    }
  }

  return additionalHoursBreakdown;
};
