import { Table } from "react-bootstrap";
import { ParsedApiShift } from "../../../../../types/commonTypes";
import { useNavigate } from "@tanstack/react-router";
import LogTableRow from "./LogTableRow";

const LogTable = ({ log }: { log: ParsedApiShift[] }) => {
    const navigate = useNavigate();

    return (
        <div>
            <Table striped={true} hover={true} responsive={true}>
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
                    {log.map((x) => (
                        <LogTableRow
                            key={x.id}
                            logShift={x}
                            onClick={() =>
                                navigate({
                                    to: "/log/$shiftId",
                                    params: { shiftId: x.id.toString() },
                                })
                            }
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default LogTable;
