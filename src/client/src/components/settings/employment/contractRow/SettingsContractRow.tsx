import { useLoaderData } from "@tanstack/react-router";
import { Contract } from "../../../../../../../types/commonTypes";
import { filterOptionsByDate } from "../../../../../../shared/utils/lookup";
import { formatDate } from "../../../../../../shared/utils/formatDates";
import { convertToGbp } from "../../../../../../shared/utils/conversions";
import { LeaveReliefUsh } from "section-2";

const hcaMap = {
    1: "Inner London",
    2: "outer London",
    3: "Fringe",
};

export const ushTypeMap: { [key in LeaveReliefUsh]: string } = {
    best: "Best of 13/52 week average",
    average52: "52 week average",
    average13: "13 week average",
    flat: "Flat",
    none: "None",
};
const SettingsContractRow = ({
    contract,
    onClick,
    isEditing = false,
}: {
    contract: Contract;
    onClick?: () => void;
    isEditing: boolean;
}) => {
    const { payBands } = useLoaderData({
        from: "/_private",
    });
    const filteredPayBands = filterOptionsByDate(
        payBands,
        contract.from || contract.to || ""
    );

    return (
        <tr onClick={onClick}>
            <td>
                {contract.from ? (
                    formatDate(contract.from, "dd/mm/yy")
                ) : (
                    <span className="text-muted">
                        <em>Not set</em>
                    </span>
                )}
            </td>
            <td>
                {contract.to ? (
                    formatDate(contract.to, "dd/mm/yy")
                ) : (
                    <span className="text-muted">
                        <em>Not set</em>
                    </span>
                )}
            </td>
            <td>
                {filteredPayBands.find(
                    (y) => contract.pay_group_id === y.group_id
                )?.label || ""}
            </td>
            <td>
                {contract.hca_group_id ? (
                    hcaMap[contract.hca_group_id]
                ) : (
                    <span className="text-muted">
                        <em>None</em>
                    </span>
                )}
            </td>
            <td>{contract.weekly_hours}</td>
            <td>{contract.pension_perc * 100}%</td>
            <td colSpan={2}>
                {convertToGbp(contract.personal_allowance)}{" "}
                <span className="small text-muted">
                    {contract.cumulative ? "cumulative" : "non-cumulative"}
                </span>
            </td>
            <td>
                {contract.student_loan || (
                    <span className="text-muted">
                        <em>None</em>
                    </span>
                )}
            </td>
            <td>{contract.half_is_all_ush ? "Yes" : "No"}</td>
            <td>{contract.break_from_higher ? "Yes" : "No"}</td>
            <td>{ushTypeMap[contract.leave_relief_ush_type]}</td>
            {isEditing && <td />}
        </tr>
    );
};

export default SettingsContractRow;
