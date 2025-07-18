import { ParsedApiShift } from "../../../../../types/commonTypes";
import { convertToGbp } from "../../../../shared/utils/conversions";
import { memo } from "react";

// eslint-disable-next-line react/display-name
const LogTableRow = memo(
    ({
        logShift,
        onClick,
    }: {
        logShift: ParsedApiShift;
        onClick: () => void;
    }) => {
        return (
            <tr style={{ cursor: "pointer" }} onClick={onClick}>
                <td>{logShift.from}</td>
                <td>{logShift.start}</td>
                <td>{logShift.planned_end}</td>
                <td>{logShift.actual_end}</td>
                <td>{logShift.employment_name}</td>
                <td>{logShift.type}</td>
                <td>{logShift.overrun_type}</td>
                <td>{logShift.toil}</td>
                <td>{logShift.lower_rate}</td>
                <td>{logShift.higher_rate}</td>
                <td>{logShift.flat}</td>
                <td>{logShift.time_and_half}</td>
                <td>{logShift.double}</td>
                <td>{convertToGbp(logShift.extra_pay)}</td>
            </tr>
        );
    }
);

export default LogTableRow;
