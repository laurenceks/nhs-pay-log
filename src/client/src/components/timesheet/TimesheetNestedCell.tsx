import { ApiTimesheet } from "../../../../../types/commonTypes";

const TimesheetNestedCell = ({
    shifts,
    restDay = false,
    planned = false,
    overrun = false,
    absence = false,
    sick = false,
}: {
    shifts:
        | ApiTimesheet["rows"][number]["plannedShifts"]
        | ApiTimesheet["rows"][number]["actualShifts"]
        | ApiTimesheet["rows"][number]["absences"];
    restDay?: boolean;
    planned?: boolean;
    overrun?: boolean;
    absence?: boolean;
    sick?: boolean;
}) => {
    const nullLabel = restDay ? "Rest day" : "";
    return (
        <td
            className={`text-center ${shifts.length > 1 ? "table-timesheet-nested" : ""} ${restDay ? "table-timesheet-rest-day" : ""} ${overrun ? "table-timesheet-overrun" : ""} ${absence ? "table-timesheet-absence" : ""} ${sick ? "table-timesheet-sick" : ""}`}
        >
            {shifts.length ? (
                shifts.length > 1 ? (
                    <table className="w-100">
                        <tbody>
                            {shifts.map((x) => (
                                <tr key={x.label}>
                                    <td
                                        className={`text-center ${planned && "ot" in x && x.ot ? "table-timesheet-ot" : ""}`}
                                    >
                                        {x.label}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    shifts[0].label
                )
            ) : (
                nullLabel
            )}
        </td>
    );
};

export default TimesheetNestedCell;
