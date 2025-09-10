import { useLoaderData } from "@tanstack/react-router";
import { Contract } from "../../../../../../../types/commonTypes";
import { filterOptionsByDate } from "../../../../../../shared/utils/lookup";
import { formatDate } from "../../../../../../shared/utils/formatDates";
import { convertToGbp } from "../../../../../../shared/utils/conversions";

const hcaMap = {
    1: "Inner London",
    2: "outer London",
    3: "Fringe",
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
            <td>{convertToGbp(contract.personal_allowance)}</td>
            <td>
                {contract.student_loan || (
                    <span className="text-muted">
                        <em>None</em>
                    </span>
                )}
            </td>
            <td>{contract.half_is_all_ush ? "Yes" : "No"}</td>
            <td>{contract.break_from_higher ? "Yes" : "No"}</td>
            {isEditing && <td />}
        </tr>
    );
};

export default SettingsContractRow;
