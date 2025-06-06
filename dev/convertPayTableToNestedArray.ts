import * as fs from "fs";
import * as path from "path";
import { mockPayTable } from "../tests/data/mockPayTable";
import { PayTableRaw, PayTableStructured } from "../types/lookupTypes";

const newTable: PayTableStructured = {};

(mockPayTable as PayTableRaw).forEach((x) => {
    const newValue: PayTableStructured[string]["values"][0] = {
        from: x.from || null,
        to: x.to || null,
        pay_hourly: x.pay_hourly,
        pay_monthly: x.pay_monthly,
        pay_annually: x.pay_annually,
        lower_rate: x.lower_rate,
        higher_rate: x.higher_rate,
    };

    if (newTable[x.id]) {
        newTable[x.id].values.push(newValue);
    } else {
        newTable[x.id] = {
            label: x.label,
            experience: x.experience,
            values: [newValue],
        };
    }
});

fs.writeFileSync(
    path.resolve("./tests/data/mockPayTable.ts"),
    `import { PayTableStructured } from "../../types/lookupTypes";

const mockPayTable: PayTableStructured = ${JSON.stringify(newTable)};

export default mockPayTable;`
);
