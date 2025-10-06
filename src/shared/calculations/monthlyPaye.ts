import {
    EnglishIncomeTax,
    EnglishTaxRates,
    ScottishIncomeTax,
    ScottishTaxRates,
} from "@saving-tool/hmrc-income-tax/lib/types";

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const calculateEnglishCumulativePayeTaxes = ({
    cumulativeIncomeTaxPaid,
    cumulativeTaxableIncome,
    monthNumber,
    personalAllowance,
    taxRates,
}: {
    cumulativeIncomeTaxPaid: number;
    cumulativeTaxableIncome: number;
    monthNumber: MonthNumber;
    personalAllowance: number;
    taxRates: EnglishTaxRates;
}): EnglishIncomeTax => {
    const {
        BASIC_RATE,
        HIGHER_RATE,
        ADDITIONAL_RATE,
        HIGHER_BRACKET,
        ADDITIONAL_BRACKET,
    } = taxRates;

    const proRata = monthNumber / 12;
    const adjustedTaxableIncome = Math.max(
        0,
        cumulativeTaxableIncome - personalAllowance * proRata
    );

    const basicBand = Math.min(adjustedTaxableIncome, HIGHER_BRACKET * proRata);
    const higherBand = Math.min(
        Math.max(adjustedTaxableIncome - basicBand, 0),
        (ADDITIONAL_BRACKET - HIGHER_BRACKET) * proRata
    );
    const additionalBand = Math.max(
        adjustedTaxableIncome - basicBand - higherBand,
        0
    );

    //YTD totals
    const basicRateTax = basicBand * BASIC_RATE;
    const higherRateTax = higherBand * HIGHER_RATE;
    const additionalRateTax = additionalBand * ADDITIONAL_RATE;

    //This month's PAYE
    const total = Math.max(
        0,
        basicRateTax +
            higherRateTax +
            additionalRateTax -
            cumulativeIncomeTaxPaid
    );

    return {
        total,
        incomeTaxType: "England/NI/Wales",
        breakdown: {
            basicRateTax,
            higherRateTax,
            additionalRateTax,
        },
    };
};
export const calculateScottishCumulativePayeTaxes = ({
    cumulativeIncomeTaxPaid,
    cumulativeTaxableIncome,
    monthNumber,
    personalAllowance,
    taxRates,
}: {
    cumulativeIncomeTaxPaid: number;
    cumulativeTaxableIncome: number;
    monthNumber: MonthNumber;
    personalAllowance: number;
    taxRates: ScottishTaxRates;
}): ScottishIncomeTax => {
    const {
        STARTER_RATE,
        BASIC_RATE,
        INTERMEDIATE_RATE,
        HIGHER_RATE,
        ADVANCED_RATE,
        TOP_RATE,
        BASIC_BRACKET,
        INTERMEDIATE_BRACKET,
        HIGHER_BRACKET,
        ADVANCED_BRACKET,
        TOP_BRACKET,
    } = taxRates;

    const proRata = monthNumber / 12;
    const adjustedTaxableIncome = Math.max(
        0,
        cumulativeTaxableIncome - personalAllowance * proRata
    );

    const starterBand = Math.min(
        adjustedTaxableIncome,
        Math.max(0, (BASIC_BRACKET - personalAllowance) * proRata)
    );
    const basicBand = Math.min(
        Math.max(adjustedTaxableIncome - starterBand, 0),
        (INTERMEDIATE_BRACKET - BASIC_BRACKET) * proRata
    );

    const intermediateBand = Math.min(
        Math.max(adjustedTaxableIncome - starterBand - basicBand, 0),
        (HIGHER_BRACKET - INTERMEDIATE_BRACKET) * proRata
    );
    const higherBand = Math.min(
        Math.max(
            adjustedTaxableIncome - starterBand - basicBand - intermediateBand,
            0
        ),
        (ADVANCED_BRACKET - HIGHER_BRACKET) * proRata
    );
    const advancedBand = Math.min(
        Math.max(
            adjustedTaxableIncome -
                starterBand -
                basicBand -
                intermediateBand -
                higherBand,
            0
        ),
        (TOP_BRACKET - ADVANCED_BRACKET) * proRata
    );
    const topBand = Math.max(
        adjustedTaxableIncome -
            starterBand -
            basicBand -
            intermediateBand -
            higherBand -
            advancedBand,
        0
    );

    // YTD totals per band
    const starterRateTax = starterBand * STARTER_RATE;
    const basicRateTax = basicBand * BASIC_RATE;
    const intermediateRateTax = intermediateBand * INTERMEDIATE_RATE;
    const higherRateTax = higherBand * HIGHER_RATE;
    const advancedRateTax = advancedBand * ADVANCED_RATE;
    const topRateTax = topBand * TOP_RATE;

    // This month's PAYE
    const total = Math.max(
        0,
        starterRateTax +
            basicRateTax +
            intermediateRateTax +
            higherRateTax +
            advancedRateTax +
            topRateTax -
            cumulativeIncomeTaxPaid
    );

    return {
        total,
        incomeTaxType: "Scotland",
        breakdown: {
            starterRateTax,
            basicRateTax,
            intermediateRateTax,
            higherRateTax,
            advancedRateTax,
            topRateTax,
        },
    };
};
