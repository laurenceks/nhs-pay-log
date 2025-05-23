import { Table } from "react-bootstrap";
import { LogShift } from "../../../../types/commonTypes";
import { formatDate } from "../../../shared/utils/formatDates.ts";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import calculateExtraPay from "../../../shared/calculations/calculateExtraPay.ts";

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
        <Table striped={true} hover={true} className="overflow-x-scroll">
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
                                <td>{x.plannedEnd}</td>
                                <td>{x.actualEnd}</td>
                                <td>{x.employment}</td>
                                <td>{x.type}</td>
                                <td>{x.overrunType}</td>
                                <td>{x.toil}</td>
                                <td>{x.lowerRate}</td>
                                <td>{x.higherRate}</td>
                                <td>{x.flat}</td>
                                <td>{x.timeAndHalf}</td>
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
    );
};

export default LogTable;
