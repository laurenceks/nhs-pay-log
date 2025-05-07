export const msToDecimalHours = (timeInMs: number) => timeInMs / 3600000;

export const makeToDateAlwaysLater = (
  from: Date | string,
  to: Date | string,
) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const fromTime = fromDate.getTime();
  const toTime = toDate.getTime();

  if (fromTime > toTime) {
    toDate.setDate(toDate.getDate() + 1);
  }
  return { fromDate, toDate };
};

export const convertToDate = (val: Date | string) =>
  typeof val === "string" ? new Date(val) : val;
export const convertToNumber = (val: Date | string | number) =>
  typeof val === "number" ? val : convertToDate(val).getTime();
