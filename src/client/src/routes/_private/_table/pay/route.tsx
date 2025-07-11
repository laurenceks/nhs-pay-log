import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import Pay from "../../../../components/pay/Pay";
import { ParsedApiPay } from "../../../../../../../types/commonTypes";
import { stripQueryOptionsForEnsureQuery } from "../../../../queries/queryUtils";
import { getPayQueryOptions } from "../../../../queries/payQueries";

export const Route = createFileRoute("/_private/_table/pay")({
    component: memo(Pay),
    loader: async ({ context }) => {
        const pay: ParsedApiPay[] =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getPayQueryOptions)
                )
            ).data?.map((x) => {
                return {
                    ...x,
                    extra_hours: Number(x.extra_hours),
                    extra_pay: Number(x.extra_pay),
                    extras_pay: Number(x.extras_pay),
                    rate: Number(x.rate),
                    shift_pay: Number(x.shift_pay),
                    total_ush: Number(x.total_ush),
                    basic_pay: Number(x.basic_pay),
                    hca_pay: Number(x.hca_pay),
                    gross_pay: Number(x.gross_pay),
                    pensionable_pay: Number(x.pensionable_pay),
                    taxable_pay: Number(x.taxable_pay),
                    flowers_hours: Number(x.flowers_hours),
                    flowers_pay: Number(x.flowers_pay),
                };
            }) || [];

        return { pay };
    },
});
