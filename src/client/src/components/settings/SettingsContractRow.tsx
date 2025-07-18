import { useLoaderData } from "@tanstack/react-router";
import { formatDate } from "../../../../shared/utils/formatDates";
import { filterOptionsByDate } from "../../../../shared/utils/lookup";
import { Contract } from "../../../../../types/commonTypes";

const hcaMap = {
    1: "Inner London",
    2: "outer London",
    3: "Fringe",
};
const SettingsContractRow = ({
    contract,
    onClick,
}: {
    contract: Contract;
    onClick: () => void;
}) => {
    const { payBands } = useLoaderData({
        from: "/_private",
    });
    const filteredPayBands = filterOptionsByDate(
        payBands,
        contract.from || contract.to || ""
    );

    return (
        <tr
            style={{
                cursor: "pointer",
            }}
            onClick={onClick}
        >
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
            <td>
                {contract.student_loan || (
                    <span className="text-muted">
                        <em>None</em>
                    </span>
                )}
            </td>
        </tr>
    );
};

export default SettingsContractRow;
