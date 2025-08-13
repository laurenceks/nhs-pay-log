const TimesheetExtraCell = ({ value }: { value: number }) => {
    return <td className="text-center">{value ? "Yes" : ""}</td>;
};

export default TimesheetExtraCell;
