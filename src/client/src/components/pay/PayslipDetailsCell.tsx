const PayslipDetailsCell = ({
    title,
    value,
}: {
    title: string;
    value: string;
}) => {
    return (
        <div className="payslip-details-cell shade d-flex flex-column b-r">
            <p className="fw-bold t-sm text-center text-uppercase m-0">
                {title}
            </p>
            <p className="t-">{value}</p>
        </div>
    );
};

export default PayslipDetailsCell;
