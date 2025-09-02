import { useLoaderData } from "@tanstack/react-router";
import { formatDate } from "../../../../shared/utils/formatDates";
import TimesheetNestedCell from "./TimesheetNestedCell";
import TimesheetTimeCell from "./TimesheetTimeCell";
import TimesheetExtraCell from "./TimesheetExtraCell";

const Timesheet = () => {
    const {
        timesheet: { rows, totals },
    } = useLoaderData({
        from: "/_private/_nav/_table/timesheet/$employmentId/$timesheetMonth",
    });

    return (
        <div className="table-timesheet-container pb-5">
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
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        return (
                            <tr key={row.date}>
                                <td>
                                    {formatDate(row.date, "dd/mm/yyyy (ddd)")}
                                </td>
                                <TimesheetNestedCell
                                    shifts={row.plannedShifts}
                                    restDay={
                                        !row.plannedShifts.length &&
                                        !row.actualShifts.length &&
                                        !row.absences.length
                                    }
                                    planned
                                />
                                <TimesheetNestedCell
                                    shifts={row.actualShifts}
                                    overrun={row.overrun}
                                />
                                <TimesheetNestedCell
                                    shifts={row.absences}
                                    absence={!!row.absences.length}
                                    sick={row.sick}
                                />
                                <TimesheetTimeCell
                                    value={row.additionalHours}
                                />
                                <TimesheetTimeCell value={row.timeAndHalf} />
                                <TimesheetTimeCell value={row.double} />
                                <TimesheetTimeCell value={row.toil} />
                                <TimesheetTimeCell value={row.lowerRate} />
                                <TimesheetTimeCell value={row.higherRate} />
                                <TimesheetTimeCell value={row.totalUsh} />
                                <TimesheetExtraCell value={row.snsc} />
                                <TimesheetExtraCell value={row.ooamb} />
                                <TimesheetExtraCell value={row.oowmb} />
                                <td>{row.notes}</td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td></td>
                        <TimesheetTimeCell value={totals.plannedShift} />
                        <TimesheetTimeCell value={totals.actualShift} />
                        <TimesheetTimeCell value={totals.absentHours} />
                        <TimesheetTimeCell value={totals.additionalHours} />
                        <TimesheetTimeCell value={totals.timeAndHalf} />
                        <TimesheetTimeCell value={totals.double} />
                        <TimesheetTimeCell value={totals.toil} />
                        <TimesheetTimeCell value={totals.lowerRate} />
                        <TimesheetTimeCell value={totals.higherRate} />
                        <TimesheetTimeCell value={totals.totalUsh} />
                        <td className="text-center">{totals.snsc || ""}</td>
                        <td className="text-center">{totals.ooamb || ""}</td>
                        <td className="text-center">{totals.oowmb || ""}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Timesheet;
