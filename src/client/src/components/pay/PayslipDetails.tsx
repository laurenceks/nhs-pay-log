import PayslipDetailsCell from "./PayslipDetailsCell";

const PayslipDetails = () => {
    return (
        <div className="b-l b-t b-r bb h-100">
            <div className="b-b bb h-100 mh-100">
                <div className="payslip-details-row b-b">
                    <PayslipDetailsCell
                        title="Assignment number"
                        value="12345678"
                    />
                    <PayslipDetailsCell
                        title="Employee Name"
                        value="Mr. John Smith"
                    />
                    <PayslipDetailsCell
                        title="Location"
                        value="Chertsey Ambulance Station"
                    />
                </div>
                <div className="payslip-details-row b-b">
                    <PayslipDetailsCell
                        title="Department"
                        value="Chertsey Dispatc"
                    />
                    <PayslipDetailsCell
                        title="Job Title"
                        value="Ambulance Paramedic"
                    />
                    <PayslipDetailsCell
                        title="Payscale"
                        value="Non Review Body Band 6"
                    />
                </div>
                <div className="payslip-details-row">
                    <div className="b-r">
                        <img
                            alt="NHS Pay Log logo"
                            src="/logo.svg"
                            className="object-fit-contain mw-100 mh-100"
                        />
                    </div>
                    <div>
                        <PayslipDetailsCell
                            title="Job Title"
                            value="Ambulance Paramedic"
                        />
                        <PayslipDetailsCell
                            title="Payscale"
                            value="Non Review Body Band 6"
                        />
                        <PayslipDetailsCell
                            title="Payscale"
                            value="Non Review Body Band 6"
                        />
                        <PayslipDetailsCell
                            title="Payscale"
                            value="Non Review Body Band 6"
                        />
                    </div>
                    <div>
                        <PayslipDetailsCell
                            title="Job Title"
                            value="Ambulance Paramedic"
                        />
                        <PayslipDetailsCell
                            title="Payscale"
                            value="Non Review Body Band 6"
                        />
                        <PayslipDetailsCell
                            title="Payscale"
                            value="Non Review Body Band 6"
                        />
                        <PayslipDetailsCell
                            title="Payscale"
                            value="Non Review Body Band 6"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayslipDetails;
