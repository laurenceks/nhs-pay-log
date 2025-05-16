import { Table } from "react-bootstrap";
import { Dispatch, SetStateAction } from "react";
import { LogShift, ShiftEditModalState } from "../../../../types/commonTypes";
import mockLogData from "../../../../tests/data/mockLogData.ts";

const LogTable = ({
    setModalState,
}: {
    setModalState: Dispatch<SetStateAction<ShiftEditModalState>>;
}) => {
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
                {mockLogData.map((x) => {
                    return (
                        <tr
                            key={x.date + x.start + x.actualEnd}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setModalState({
                                    show: true,
                                    shift: x as LogShift,
                                });
                            }}
                        >
                            <td>{x.date}</td>
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
                            <td>£-</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};

export default LogTable;
