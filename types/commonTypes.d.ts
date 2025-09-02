import { Employment, LookupTable } from "./lookupTypes";
import { filterFns } from "@tanstack/table-core/src/filterFns";
import { Variant } from "react-bootstrap/types";

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
    date: string;
    employment_id: Employment["id"];
    employment_name: Employment["name"];
    extras_ids_string: string;
    from: string;
    id: number;
    notes: string;
    overrun_type: Overruns;
    pay_id_override: string | null;
    planned_end: string;
    planned_to: string;
    selectedExtras?: ShiftExtra[];
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
    absent_hours: number;
};

export type CalculatedHours = USH & AdditionalHours;

export interface ClientShift extends AdditionalHours, USH, ShiftEdit {
    pay_date: string;
    pay_month: string;
    pay_financial_year: string;
    flowers_pay_month: string;
    weekly_hours: Contract["weekly_hours"];
    // incentive: number;
    // incentiveHours: number;
    // incentiveType: number;
    // mileage: number;
    // mileageLocation: string;
    // mileageType: string;
}

export type TimesheetOption = {
    employment_id: Employment["id"];
    employment_name: ApiShift["employment_name"];
    timesheet_month: string;
    label: string;
};
export interface TimesheetShift
    extends Omit<
        ClientShift,
        | "from"
        | "planned_to"
        | "actual_to"
        | "selectedExtras"
        | "extras_ids_string"
        | "contract_id"
        | "weekly_hours"
    > {
    type: ShiftTypes | "Rest day";
    total_ush: number;
    absent_hours: number;
    additional_hours: number;
    planned_shift: number;
    actual_shift: number;
    snsc: number;
    ooamb: number;
    oowmb: number;
}

export type ApiTimesheet = {
    rows: {
        date: string;
        plannedShifts: { label: string; ot: boolean }[];
        actualShifts: { label: string; overrun: boolean }[];
        absences: { label: string; toil: boolean }[];
        additionalHours: number;
        timeAndHalf: number;
        double: number;
        toil: number;
        lowerRate: number;
        higherRate: number;
        totalUsh: number;
        absentHours: number;
        plannedShift: number;
        actualShift: number;
        overrun: boolean;
        sick: boolean;
        snsc: number;
        ooamb: number;
        oowmb: number;
    }[];
    totals: {
        additionalHours: number;
        timeAndHalf: number;
        double: number;
        toil: number;
        lowerRate: number;
        higherRate: number;
        totalUsh: number;
        absentHours: number;
        plannedShift: number;
        actualShift: number;
        snsc: number;
        ooamb: number;
        oowmb: number;
    };
};

interface ShiftStringToNumberKeys {
    extra_hours: string;
    extra_pay: string;
    extras_pay: string;
    rate: string;
    shift_pay: string;
    total_ush: string;
    absent_hours: string;
}
interface PayStringToNumberKeys
    extends Omit<ShiftStringToNumberKeys, "absent_hours"> {
    pensionable_pay: string;
    taxable_pay: string;
    ni_able_pay: string;
    hca_pay: string;
    basic_pay: string;
    gross_pay: string;
    flowers_hours: string;
    flowers_pay: string;
    pension_perc: string;
    personal_allowance: string;
    weekly_hours_perc: string;
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
            | "absent_hours"
        >,
        PayStringToNumberKeys {
    student_loan: 1 | 2 | 4 | 5 | 6 | null; //6=postgrad
}
export interface ApiPayslip {
    amount: string;
    due: string;
    label: string;
    rate: string;
    worked: string;
}

export type ParsedApiShift = Omit<ApiShift, keyof ShiftStringToNumberKeys> & {
    [K in keyof ShiftStringToNumberKeys]: number;
};

export type ParsedApiPay = Omit<ApiPay, keyof PayStringToNumberKeys> & {
    [K in keyof PayStringToNumberKeys]: number;
} & {
    deduction_ni: number;
    deduction_paye: number;
    deduction_student_loan: number;
    deduction_pension: number;
    deductions_total: number;
    net_pay: number;
    weekly_hours_perc: number;
};

export type ParsedApiPayslip = Pick<ApiPayslip, "label"> & {
    [K in keyof Omit<ApiPayslip, "label">]: number | string;
};

export interface ApiHours extends AdditionalHours, USH {
    absent_hours: number;
    actual_hours: number;
    core_hours: number;
    extra_hours: number;
    normal_hours: number;
    overrun_hours: number;
    planned_hours: number;
    week_commencing: string;
    weekly_hours: number;
    weekly_hours_diff: number;
    worked_hours: number;
}

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

export type Contract = {
    id: number;
    from: string | null;
    to: string | null;
    weekly_hours: number;
    hca_perc: number;
    pension_perc: number;
    personal_allowance: number;
    student_loan: ApiPay["student_loan"];
    employment_id: Employment["id"];
    employment_name: Employment["name"];
    pay_group_id: Employment["pay_group_id"];
    hca_group_id: 1 | 2 | 3 | null;
};

export type EmploymentEdit = {
    name: Employment["name"];
    id: Employment["id"];
    contracts: Contract[];
};

export type EmploymentReducerContractKeys = keyof Omit<
    Contract,
    "id" | "employment_id" | "employment_name" | "from" | "to" | "hca_perc"
>;

export type VerificationToken = {
    user_id: string;
    selector: string;
    token: string;
    hash: string;
    salt: string;
    expires_at: string;
};

export type ColumnIconDataType = "size" | "alpha" | "numeric";

export type ColumnIconMap<T> = {
    [key in keyof Partial<T>]: ColumnIconDataType;
};

type customColumnFilters =
    | keyof typeof filterFns
    | "inDateRange"
    | "inTimeRange"
    | "shiftType"
    | "overrunType";

export type ColumnFilterMap<T> = {
    [key in keyof Partial<T>]: customColumnFilters;
};

export type Aggregations = "sum" | "mean" | "median" | "min" | "max";
export type Aggregated = { [key: string]: string | number };

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

declare module "@tanstack/react-table" {
    interface FilterFns {
        inDateRange: FilterFn<ParsedApiShift>;
        inTimeRange: FilterFn<ParsedApiShift>;
        inArray: FilterFn<ParsedApiShift>;
    }

    interface ColumnMeta<_TData extends RowData, _TValue> {
        textVariant?: Variant;
        iconType?: ColumnIconDataType;
        aggregationTypes?: "all" | Aggregations[];
    }
}
