const TimesheetExtraCell = ({ value }: { value: number }) => {
    return <td className="table-timesheet-time">{value ? "Yes" : ""}</td>;
};

export default TimesheetExtraCell;
