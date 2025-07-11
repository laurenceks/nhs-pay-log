import { LookupTable } from "./lookupTypes";

export type Overruns = "OT" | "TOIL";

export type ShiftTypes =
    | "Normal"
    | "AL"
    | "AL (relief)"
    | "Absent (TOIL)"
    | "Absent (TOIL relief)"
    | "Sick"
    | "Bank"
    | Overruns;

export type ShiftExtra = {
    to: LookupTable[0]["to"];
    from: LookupTable[0]["from"];
    label: string;
    id: number;
    group_id: number;
    value: string | number;
};

export interface ShiftEdit {
    actual_end: string;
    actual_to: string;
    contract_id: Contract["id"];
    contract_name: Contract["name"];
    date: string;
    employment_id: Employment["id"];
    employment_name: Employment["name"];
    selectedExtras?: ShiftExtra[];
    extras_ids_string: string;
    from: string;
    id: number;
    overrun_type: Overruns;
    pay_id_override: string | null;
    planned_end: string;
    planned_to: string;
    start: string;
    type: ShiftTypes;
}

export type USH = {
    higher_rate: number;
    lower_rate: number;
};

export type AdditionalHours = {
    flat: number;
    time_and_half: number;
    toil: number;
    double: number;
};

export type CalculatedHours = USH & AdditionalHours;

export interface ClientShift extends AdditionalHours, USH, ShiftEdit {
    pay_date: string;
    pay_month: string;
    pay_financial_year: string;
    weekly_hours: Contract["weekly_hours"];
    // incentive: number;
    // incentiveHours: number;
    // incentiveType: number;
    // mileage: number;
    // mileageLocation: string;
    // mileageType: string;
}

interface ShiftStringToNumberKeys {
    extra_hours: string;
    extra_pay: string;
    extras_pay: string;
    rate: string;
    shift_pay: string;
    total_ush: string;
}
interface PayStringToNumberKeys extends ShiftStringToNumberKeys {
    pensionable_pay: string;
    taxable_pay: string;
    hca_pay: string;
    basic_pay: string;
    gross_pay: string;
    flowers_hours: string;
    flowers_pay: string;
}

export interface ApiShift
    extends Omit<ClientShift, "selectedExtras">,
        ShiftStringToNumberKeys {}
export interface ApiPay
    extends Omit<
            ClientShift,
            | "selectedExtras"
            | "from"
            | "planned_to"
            | "actual_to"
            | "start"
            | "planned_end"
            | "actual_end"
            | "id"
        >,
        PayStringToNumberKeys {}

export type ParsedApiShift = Omit<ApiShift, keyof ShiftStringToNumberKeys> & {
    [K in keyof ShiftStringToNumberKeys]: number;
};

export type ParsedApiPay = Omit<ApiPay, keyof PayStringToNumberKeys> & {
    [K in keyof PayStringToNumberKeys]: number;
};

export interface ClientUser {
    id: string;
    email: string;
}

export interface ApiUser extends ClientUser {
    hash: string;
    salt: string;
    createdAt: string;
    updatedAt: string;
    verified: boolean;
}

export type Employment = {
    id: number;
    name: string;
    from: string | null;
    to: string | null;
};

export type Contract = {
    id: number;
    name: string;
    from: string | null;
    to: string | null;
    weekly_hours: number;
    hca_perc: number;
    employment_id: Employment["id"];
    employment_name: Employment["name"];
    pay_group_id: number;
};

export type VerificationToken = {
    user_id: string;
    selector: string;
    token: string;
    hash: string;
    salt: string;
    expires_at: string;
};

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends ClientUser {}
        interface Request {
            authenticatedUser: CustomUser;
            userId: string;
        }
    }
}
