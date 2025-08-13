import { msToFormattedHours } from "../../../../shared/utils/conversions";

const TimesheetTimeCell = ({ value }: { value: number }) => {
    return (
        <td className="text-center">
            {value ? msToFormattedHours(value) : ""}
        </td>
    );
};

export default TimesheetTimeCell;
