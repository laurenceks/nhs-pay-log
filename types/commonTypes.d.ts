export type Overruns = "OT" | "TOIL";

export type Shifts =
  | "Normal"
  | "AL"
  | "AL (relief)"
  | "Absent (TOIL)"
  | "Sick"
  | Overruns;
