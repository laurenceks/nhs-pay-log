import { msToFormattedHours } from "../../../../shared/utils/conversions";

const TimesheetTimeCell = ({ value }: { value: number }) => {
    return (
        <td className="table-timesheet-time">
            {value ? msToFormattedHours(value) : ""}
        </td>
    );
};

export default TimesheetTimeCell;
