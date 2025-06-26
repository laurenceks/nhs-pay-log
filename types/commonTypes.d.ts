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
    name: string;
    id: string;
    value: number;
};

export type ShiftEdit = {
    date: string;
    from: string;
    planned_to: string;
    actual_to: string;
    id: number;
    actual_end: string;
    employment_id: number;
    employment_name: string;
    extras: ShiftExtra["id"][];
    overrun_type: Overruns;
    planned_end: string;
    start: string;
    type: ShiftTypes;
    pay_id_override: string | null;
};

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

export type LogShift = AdditionalHours &
    USH &
    ShiftEdit & {
        employment_name: string;
        pay_date: string;
        pay_month: string;
        pay_financial_year: string;
        // incentive: number;
        // incentiveHours: number;
        // incentiveType: number;
        // mileage: number;
        // mileageLocation: string;
        // mileageType: string;
    };

export type ShiftEditModalState = { show: boolean; shift: LogShift | null };

export interface ClientUser {
    id: string;
    email: string;
}

export interface ApiUser extends ClientUser {
    hash: string;
    salt: string;
    createdAt: string;
    updatedAt: string;
}

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends ClientUser {}
        interface Request {
            authenticatedUser: CustomUser;
        }
    }
}

export type Employment = {
    id: number;
    name: string;
    from: string | null;
    to: string | null;
    pay_group_id: string;
    weekly_hours: number;
};
