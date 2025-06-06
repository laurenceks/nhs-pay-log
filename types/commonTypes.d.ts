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
    id: string;
    actual_end: string;
    employment_id: string;
    extras: ShiftExtra["id"][];
    overrun_type: Overruns;
    planned_end: string;
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
        // incentive: number;
        // incentiveHours: number;
        // incentiveType: number;
        // mileage: number;
        // mileageLocation: string;
        // mileageType: string;
    };

export type ShiftEditModalState = { show: boolean; shift: LogShift | null };
