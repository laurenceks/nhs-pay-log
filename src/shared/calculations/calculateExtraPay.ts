import { LogShift } from "../../../types/commonTypes";
import { lookupPayByEmployment, lookupShiftExtra } from "../utils/lookup";
import mockExtrasLookup from "../../../tests/data/mockExtrasLookup";
import { msToDecimalHours } from "../utils/conversions";
import { PayTableItemValue } from "../../../types/lookupTypes";

const calculateExtraPay = (logShift: LogShift) => {
    const pay = lookupPayByEmployment({
        d: logShift.date,
        employment_id: logShift.employment_id,
    }) as PayTableItemValue;

    const extrasSubtotal = (logShift.extras || []).reduce((acc, val) => {
        return acc + lookupShiftExtra(mockExtrasLookup, logShift.date, val);
    }, 0);

    if (pay) {
        return (
            msToDecimalHours(logShift.flat) * pay.pay_hourly +
            msToDecimalHours(logShift.lower_rate) *
                pay.pay_hourly *
                pay.lower_rate +
            msToDecimalHours(logShift.time_and_half) * pay.pay_hourly * 1.5 +
            msToDecimalHours(logShift.higher_rate) *
                pay.pay_hourly *
                pay.higher_rate +
            msToDecimalHours(logShift.double) * pay.pay_hourly * 2 +
            extrasSubtotal
        );
    }

    return extrasSubtotal;
};
export default calculateExtraPay;
