import { useLoaderData } from "@tanstack/react-router";
import { formatDate } from "../../../../shared/utils/formatDates";
import TimesheetNestedCell from "./TimesheetNestedCell";
import TimesheetTimeCell from "./TimesheetTimeCell";
import TimesheetExtraCell from "./TimesheetExtraCell";

const Timesheet = () => {
    const { timesheet } = useLoaderData({
        from: "/_private/_nav/_table/timesheet/$employmentId/$payMonth",
    });

    return (
        <table className="table-timesheet">
            <thead>
                <tr>
                    <th>Shift date</th>
                    <th>Planned shift</th>
                    <th>Actual shift</th>
                    <th>Absences</th>
                    <th>Additional hours</th>
                    <th>Time and half</th>
                    <th>Double time</th>
                    <th>Overtime TOIL</th>
                    <th>USH - lower rate</th>
                    <th>USH - higher rate</th>
                    <th>Unsocial hours total</th>
                    <th>S/N shift change</th>
                    <th>Meal break out of area</th>
                    <th>Meal break out of window</th>
                </tr>
            </thead>
            <tbody>
                {timesheet.map((timesheet) => {
                    return (
                        <tr key={timesheet.date}>
                            <td>
                                {formatDate(timesheet.date, "dd/mm/yyyy (ddd)")}
                            </td>
                            <TimesheetNestedCell
                                shifts={timesheet.plannedShifts}
                                restDay={
                                    !timesheet.plannedShifts.length &&
                                    !timesheet.actualShifts.length &&
                                    !timesheet.absences.length
                                }
                            />
                            <TimesheetNestedCell
                                shifts={timesheet.actualShifts}
                                overrun={timesheet.overrun}
                            />
                            <TimesheetNestedCell
                                shifts={timesheet.absences}
                                absence={!!timesheet.absences.length}
                                sick={timesheet.sick}
                            />
                            <TimesheetTimeCell
                                value={timesheet.additionalHours}
                            />
                            <TimesheetTimeCell value={timesheet.timeAndHalf} />
                            <TimesheetTimeCell value={timesheet.double} />
                            <TimesheetTimeCell value={timesheet.toil} />
                            <TimesheetTimeCell value={timesheet.lowerRate} />
                            <TimesheetTimeCell value={timesheet.higherRate} />
                            <TimesheetTimeCell value={timesheet.totalUsh} />
                            <TimesheetExtraCell value={timesheet.snsc} />
                            <TimesheetExtraCell value={timesheet.ooamb} />
                            <TimesheetExtraCell value={timesheet.oowmb} />
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default Timesheet;
