import { Table } from "react-bootstrap";
import { LogShift } from "../../../../../types/commonTypes";
import { formatDate } from "../../../../shared/utils/formatDates";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import calculateExtraPay from "../../../../shared/calculations/calculateExtraPay";
import { msToTableFormat } from "../../../../shared/utils/conversions";

const LogTable = ({ log }: { log: LogShift[] }) => {
    const navigate = useNavigate();
    const openShiftModal = useCallback(
        (id: string) =>
            navigate({
                to: "/log/$shiftId",
                params: { shiftId: id },
            }),
        []
    );
    return (
        <div className="overflow-x-scroll">
            <Table striped={true} hover={true}>
                <thead>
                    <tr>
                        <th colSpan={7}>Shift</th>
                        <th colSpan={7}>Earnings</th>
                    </tr>
                    <tr className="sticky-top">
                        <th>Date</th>
                        <th>Start</th>
                        <th>Planned end</th>
                        <th>Actual end</th>
                        <th>Employer</th>
                        <th>Type</th>
                        <th>Overrun type</th>
                        <th>TOIL</th>
                        <th>USH lower</th>
                        <th>USH higher</th>
                        <th>Flat</th>
                        <th>Time and a half</th>
                        <th>Double</th>
                        <th>Extra pay</th>
                    </tr>
                </thead>
                <tbody>
                    {log
                        .sort((a, b) => (a.from > b.from ? 1 : -1))
                        .map((x) => {
                            return (
                                <tr
                                    key={x.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => openShiftModal(x.id)}
                                >
                                    <td>{formatDate(x.from, "dd/mm/yy")}</td>
                                    <td>{x.start}</td>
                                    <td>{x.planned_end}</td>
                                    <td>{x.actual_end}</td>
                                    <td>{x.employment_id}</td>
                                    <td>{x.type}</td>
                                    <td>{x.overrun_type}</td>
                                    <td>{msToTableFormat(x.toil)}</td>
                                    <td>{msToTableFormat(x.lower_rate)}</td>
                                    <td>{msToTableFormat(x.higher_rate)}</td>
                                    <td>{msToTableFormat(x.flat)}</td>
                                    <td>{msToTableFormat(x.time_and_half)}</td>
                                    <td></td>
                                    <td>
                                        {new Intl.NumberFormat("en-GB", {
                                            style: "currency",
                                            currency: "GBP",
                                        }).format(calculateExtraPay(x))}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};

export default LogTable;
