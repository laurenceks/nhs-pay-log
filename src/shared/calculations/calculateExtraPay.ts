import { LogShift } from "../../../types/commonTypes";
import mockPayLookup from "../../../tests/data/mockPayLookup.ts";
import { lookupByDate, lookupShiftExtra } from "../utils/lookup.ts";
import mockExtrasLookup from "../../../tests/data/mockExtrasLookup.ts";

const calculateExtraPay = (logShift: LogShift) => {
    const rate =
        (lookupByDate<(typeof mockPayLookup)[0]>(
            mockPayLookup.sort((a, b) => {
                if (!a.from) return -1;
                if (!b.from) return 1;
                return a.from < b.from ? -1 : 1;
            }),
            logShift.date,
            "rate"
        ) as number) || 0;

    const extrasSubtotal = (logShift.extras || []).reduce((acc, val) => {
        return (
            acc +
            lookupShiftExtra(mockExtrasLookup, logShift.date, val.id) *
                val.quantity
        );
    }, 0);

    return (
        logShift.flat * rate +
        logShift.lowerRate * rate * 0.3 +
        logShift.timeAndHalf * rate * 1.5 +
        logShift.higherRate * rate * 0.6 +
        logShift.double * rate * 2 +
        extrasSubtotal
    );
};
export default calculateExtraPay;
