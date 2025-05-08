import { makeToDateAlwaysLater, msToDecimalHours } from "./conversions.ts";
import { isBankHoliday } from "./shiftLengths.ts";

export const calculateRawLowerRate = (from: Date, to: Date) => {
  // returns in ms the total time within the lower rate windows
  if (!from || !to) {
    return 0;
  }
  const fromTime = from.getTime();
  const toDate = makeToDateAlwaysLater(from, to).toDate;
  const toTime = toDate.getTime();
  const fromDay = from.getDay();
  const toDay = toDate.getDay();

  if (
    (fromDay === 0 && toDay === 0) ||
    (isBankHoliday(from) && isBankHoliday(to))
  ) {
    // only Sunday or BH
    return 0;
  }

  if (fromDay === 6 && toDay === 6) {
    //only Saturday
    return toTime - fromTime;
  }

  let lowerRateHours = 0;

  if ((fromDay === 6 && toDay === 0) || isBankHoliday(to)) {
    // Saturday into Sunday or into a bank holiday
    return to.setHours(0, 0, 0, 0) - fromTime;
  }

  if (
    (fromDay === 0 && toDay === 1) ||
    (isBankHoliday(from) && !isBankHoliday(to) && toDay > 0)
  ) {
    // Sunday into Monday or BH into non BH
    return (
      Math.min(toTime, toDate.setHours(6, 0, 0, 0)) -
      Math.max(fromTime, toDate.setHours(0, 0, 0, 0))
    );
  }

  const from2000 = from.setHours(20, 0, 0, 0);

  if (fromDay === 5 && toDay === 6) {
    // Friday into Saturday
    lowerRateHours = toTime - Math.max(from2000, fromTime);
  } else {
    const from0600 = from.setHours(6, 0, 0, 0);

    if (fromTime < from0600) {
      lowerRateHours += Math.min(from0600, toTime) - fromTime;
    }

    const from2400 = from.setHours(24, 0, 0, 0);

    if ((fromTime < from2000 && toTime > from2000) || fromTime > from2000) {
      lowerRateHours +=
        Math.min(toTime, from2400) - Math.max(from2000, fromTime);
    }

    if (toTime > from2400) {
      lowerRateHours +=
        Math.min(toTime, toDate.setHours(6, 0, 0, 0)) - from2400;
    }

    const to2000 = toDate.setHours(20, 0, 0, 0);

    if (toTime > to2000 && to2000 > from2400) {
      lowerRateHours += toTime - Math.max(to2000, fromTime);
    }
  }

  return lowerRateHours;
};

export const calculateRawHigherRate = (from: Date, to: Date) => {
  // calculate in ms the total time within the higher rate windows
  if (!from || !to) {
    return 0;
  }

  const fromTime = from.getTime();
  const toDate = makeToDateAlwaysLater(from, to).toDate;
  const toTime = toDate.getTime();
  const fromDay = from.getDay();
  const toDay = toDate.getDay();

  if (
    fromDay !== 0 &&
    toDay !== 0 &&
    !isBankHoliday(from) &&
    !isBankHoliday(toDate)
  ) {
    // neither Sunday nor BH
    return 0;
  }

  if (
    (fromDay === 0 && toDay === 0) ||
    (isBankHoliday(from) && isBankHoliday(toDate))
  ) {
    // all Sunday or BH
    return toTime - fromTime;
  }

  const to0000 = toDate.setHours(0, 0, 0, 0);
  if (fromDay === 6 || (!isBankHoliday(from) && isBankHoliday(toDate))) {
    // Saturday into Sunday or non-BH into BH
    return toTime - to0000;
  }
  if (fromDay === 0 || (isBankHoliday(from) && !isBankHoliday(toDate))) {
    // Sunday into Monday or BH into non-BH
    return to0000 - fromTime;
  }

  return 0;
};

export const calculateUsh = (from: Date | string, to: Date | string) => {
  const { fromDate, toDate } = makeToDateAlwaysLater(from, to);

  let lowerRateRaw = calculateRawLowerRate(
    new Date(fromDate),
    new Date(toDate),
  );
  let higherRateRaw = calculateRawHigherRate(
    new Date(fromDate),
    new Date(toDate),
  );

  const totalUshRaw = lowerRateRaw + higherRateRaw;
  const shiftLength = toDate.getTime() - fromDate.getTime();

  const remainingBreak = shiftLength > 21600000 ? 1800000 : 0;

  if (totalUshRaw >= shiftLength / 2) {
    // more than half the shift is USH
    if (!higherRateRaw) {
      // only lower rate
      lowerRateRaw = Math.max(0, shiftLength - remainingBreak);
    } else if (!lowerRateRaw) {
      // only higher rate
      higherRateRaw = Math.max(0, shiftLength - remainingBreak);
    } else {
      // take break from cheaper side
      const segmentBreak = Math.min(lowerRateRaw, remainingBreak);
      lowerRateRaw = shiftLength - higherRateRaw - segmentBreak;
      higherRateRaw -= remainingBreak - segmentBreak;
    }
  }

  return {
    lowerRate: msToDecimalHours(lowerRateRaw),
    higherRate: msToDecimalHours(higherRateRaw),
  };
  //}
};
