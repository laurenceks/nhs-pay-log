const HoursDifferenceCell = ({
    weekly_hours_diff,
}: {
    weekly_hours_diff: number;
}) => {
    return (
        <span
            className={weekly_hours_diff >= 0 ? "text-success" : "text-danger"}
        >
            {weekly_hours_diff > 0 ? "+" : ""}
            {weekly_hours_diff}
        </span>
    );
};

export default HoursDifferenceCell;
