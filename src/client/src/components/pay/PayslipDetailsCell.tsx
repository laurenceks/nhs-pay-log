const PayslipDetailsCell = ({
    title,
    value,
    centreValue = false,
}: {
    title: string;
    value: string | number;
    centreValue?: boolean;
}) => {
    return (
        <div className="payslip-details-cell shade b-r">
            <p className="fw-bold t-sm text-center text-uppercase m-0">
                {title}
            </p>
            <p className={`t-xl ${centreValue ? "text-center" : ""}`}>
                {value}
            </p>
        </div>
    );
};

export default PayslipDetailsCell;
