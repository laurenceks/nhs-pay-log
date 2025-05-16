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

export type LogShift = {
    actualEnd: string;
    date: string;
    double: number;
    employment: string;
    flat: number;
    from: string;
    plannedTo: string;
    actualTo: string;
    higherRate: number;
    id: string;
    // incentive: number;
    // incentiveHours: number;
    // incentiveType: number;
    lowerRate: number;
    // lunchAllowances: number;
    // mileage: number;
    // mileageLocation: string;
    // mileageType: string;
    overrunType: Overruns;
    plannedEnd: string;
    // snsc: number;
    start: string;
    timeAndHalf: number;
    toil: number;
    type: ShiftTypes;
};

export type ShiftEditModalState = { show: boolean; shift: LogShift | null };
