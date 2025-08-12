import { ApiTimesheet } from "../../../../../types/commonTypes";

const TimesheetNestedCell = ({
    shifts,
    restDay = false,
    overrun = false,
    absence = false,
    sick = false,
}: {
    shifts:
        | ApiTimesheet["plannedShifts"]
        | ApiTimesheet["actualShifts"]
        | ApiTimesheet["absences"];
    restDay?: boolean;
    overrun?: boolean;
    absence?: boolean;
    sick?: boolean;
}) => {
    const nullLabel = restDay ? "Rest day" : "";
    return (
        <td
            className={`table-timesheet-time ${restDay ? "table-timesheet-rest-day" : ""} ${overrun ? "table-timesheet-overrun" : ""} ${absence ? "table-timesheet-absence" : ""} ${sick ? "table-timesheet-sick" : ""}`}
        >
            {shifts.length ? (
                shifts.length > 1 ? (
                    <table>
                        <tbody>
                            {shifts.map((x) => (
                                <tr key={x.label}>
                                    <td>{x.label}</td>
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
