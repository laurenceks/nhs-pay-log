export type LookupTable<T> = (T & {
    from: string | null;
    to: string | null;
    employment_id?: number;
    contract_id?: number;
})[];

export type PayBandTable = LookupTable<{
    group_id: string;
    label: string;
    band: string;
    experience: string;
    pay_hourly: number;
    pay_monthly: number;
    pay_annually: number;
    lower_rate_multiplier: number;
    higher_rate_multiplier: number;
}>;

export type EmploymentsTable = LookupTable<{
    id: number;
    name: string;
    weekly_hours: number;
    pay_group_id: string;
}>;

export type PayBand = PayBandTable[0];
