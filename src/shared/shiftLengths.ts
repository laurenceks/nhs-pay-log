import { convertToNumber, msToDecimalHours } from "./conversions.ts";

export const calculateShiftLength = (
  from: Date | string | number,
  to: Date | string | number,
) => {
  return msToDecimalHours(convertToNumber(to) - convertToNumber(from));
};
export const calculateShiftHours = (
  from: Date | string | number,
  to: Date | string | number,
) => {
  const shiftLength = calculateShiftLength(from, to);
  return shiftLength > 6 ? shiftLength - 0.5 : shiftLength;
};
