import { ClientShift, Contract } from "../../../types/commonTypes";
import { lookupPayByContract, lookupShiftExtra } from "../utils/lookup";
import { msToDecimalHours } from "../utils/conversions";
import { ApiResponse } from "../../../types/responseTypes";
import { queryClient } from "../queryClient";

const calculateExtraPay = (logShift: ClientShift) => {
    const pay = lookupPayByContract({
        d: logShift.date,
        contractId: logShift.contract_id,
        payIdOverride: logShift.pay_id_override,
        contracts:
            (queryClient.getQueryData(["contracts"]) as ApiResponse<Contract[]>)
                ?.data || [],
    });

    const extrasSubtotal =
        (logShift.extras_ids_string?.split("") || []).reduce((acc, val) => {
            return acc + lookupShiftExtra(logShift.date, parseInt(val, 10));
        }, 0) || 0;

    if (pay) {
        return (
            msToDecimalHours(logShift.flat) * pay.pay_hourly +
            msToDecimalHours(logShift.lower_rate) *
                pay.pay_hourly *
                pay.lower_rate_multiplier +
            msToDecimalHours(logShift.time_and_half) * pay.pay_hourly * 1.5 +
            msToDecimalHours(logShift.higher_rate) *
                pay.pay_hourly *
                pay.higher_rate_multiplier +
            msToDecimalHours(logShift.double) * pay.pay_hourly * 2 +
            extrasSubtotal
        );
    }

    return extrasSubtotal;
};
export default calculateExtraPay;
