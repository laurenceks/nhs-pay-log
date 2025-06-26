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
    actual_end: string;
    actual_to: string;
    contract_id: Contract["id"];
    contract_name: Contract["name"];
    date: string;
    employment_id: Employment["id"];
    employment_name: Employment["name"];
    extras: ShiftExtra["id"][];
    from: string;
    id: number;
    overrun_type: Overruns;
    pay_id_override: string | null;
    planned_end: string;
    planned_to: string;
    start: string;
    type: ShiftTypes;
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
    employment_id: Employment["id"];
    employment_name: Employment["name"];
    pay_group_id: number;
};

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface User extends ClientUser {}
        interface Request {
            authenticatedUser: CustomUser;
        }
    }
}
