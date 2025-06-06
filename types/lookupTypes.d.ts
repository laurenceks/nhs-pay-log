export type LookupTable<T> = (T & {
    from: string | null;
    to: string | null;
    employment_id?: string;
})[];

export type PayTableRaw = LookupTable<{
    id: string;
    label: string;
    experience: string;
    pay_hourly: number;
    pay_monthly: number;
    pay_annually: number;
    lower_rate: number;
    higher_rate: number;
}>;

export type PayTableStructured = {
    [key: string]: {
        label: string;
        experience: string;
        values: LookupTable<
            Omit<
                {
                    pay_hourly: number;
                    pay_monthly: number;
                    pay_annually: number;
                    lower_rate: number;
                    higher_rate: number;
                },
                "employment_id"
            >
        >;
    };
};

export type PayTableItem = PayTableStructured[string];
export type PayTableItemValue = PayTableItem["values"][0];
