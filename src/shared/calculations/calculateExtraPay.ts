import { LogShift } from "../../../types/commonTypes";
import { lookupByDate, lookupShiftExtra } from "../utils/lookup";
import mockExtrasLookup from "../../../tests/data/mockExtrasLookup";
import { msToDecimalHours } from "../utils/conversions";
import mockEmploymentLookup from "../../../tests/data/mockEmploymentLookup";

const calculateExtraPay = (logShift: LogShift) => {
    const rate =
        (lookupByDate<(typeof mockEmploymentLookup)[0]>({
            arr: mockEmploymentLookup.sort((a, b) => {
                if (!a.from) return -1;
                if (!b.from) return 1;
                return a.from < b.from ? -1 : 1;
            }),
            d: logShift.date,
            returnKey: "rate",
            employment_id: logShift.employment_id,
        }) as number) || 0;

    const extrasSubtotal = (logShift.extras || []).reduce((acc, val) => {
        return acc + lookupShiftExtra(mockExtrasLookup, logShift.date, val);
    }, 0);

    return (
        msToDecimalHours(logShift.flat) * rate +
        msToDecimalHours(logShift.lower_rate) * rate * 0.3 +
        msToDecimalHours(logShift.time_and_half) * rate * 1.5 +
        msToDecimalHours(logShift.higher_rate) * rate * 0.6 +
        msToDecimalHours(logShift.double) * rate * 2 +
        extrasSubtotal
    );
};
export default calculateExtraPay;
