import PayslipDetailsCell from "./PayslipDetailsCell";
import { roundTo } from "round-to";

const PayslipDetails = ({
    basic_pay,
    weekly_hours_perc,
    personal_allowance,
}: {
    basic_pay: number;
    weekly_hours_perc: number;
    personal_allowance: number;
}) => {
    return (
        <div className="b-l b-t b-r bb h-100 d-flex flex-column">
            <div className="h-100 mh-100">
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
                <div className="payslip-details-row">
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
                <div className="payslip-details-row b-t bb">
                    <div className="b-r d-flex justify-content-center align-items-center p-1 shade mh-100">
                        <img
                            alt="NHS Pay Log logo"
                            src="/logo.svg"
                            className="object-fit-contain mw-100 mh-100 d-flex flex-shrink-1"
                        />
                    </div>
                    <div className="b-l">
                        <PayslipDetailsCell
                            title="Sal/wage"
                            value={roundTo(
                                (basic_pay / weekly_hours_perc) * 12,
                                2
                            ).toFixed(2)}
                            centreValue
                        />
                        <PayslipDetailsCell
                            title="Inc. Date"
                            value="08 JAN 2026"
                            centreValue
                        />
                        <PayslipDetailsCell
                            title="Standard hrs."
                            value="23"
                            centreValue
                        />
                        <PayslipDetailsCell
                            title="PT sal/wage"
                            value={roundTo(basic_pay * 12, 2).toFixed(2)}
                            centreValue
                        />
                    </div>
                    <div className="b-t b-l">
                        <PayslipDetailsCell
                            title="Tax office name"
                            value="West Kent Area"
                        />
                        <PayslipDetailsCell
                            title="Tax office ref"
                            value="123/A4B5"
                            centreValue
                        />
                        <PayslipDetailsCell
                            title="Tax code"
                            value={`${personal_allowance / 10}L CUMUL`}
                            centreValue
                        />
                        <PayslipDetailsCell
                            title="NI Number"
                            value="AB123456C"
                            centreValue
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayslipDetails;
