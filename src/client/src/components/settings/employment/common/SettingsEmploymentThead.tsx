const SettingsEmploymentThead = ({
    spanLast = false,
}: {
    spanLast?: boolean;
}) => (
    <thead>
        <tr>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Pay band</th>
            <th scope="col">HCA type</th>
            <th scope="col">Weekly hours</th>
            <th scope="col">Pension %</th>
            <th scope="col">Personal allowance</th>
            <th scope="col" colSpan={spanLast ? 2 : 1}>
                Student loan
            </th>
        </tr>
    </thead>
);

export default SettingsEmploymentThead;
