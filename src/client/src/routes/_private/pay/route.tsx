import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import { stripQueryOptionsForEnsureQuery } from "../../../queries/queryUtils";
import { ParsedApiPay } from "../../../../../../types/commonTypes";
import { getPayQueryOptions } from "../../../queries/payQueries";
import Pay from "../../../components/pay/Pay";

export const Route = createFileRoute("/_private/pay")({
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
                    total_ush: Number(x.shift_pay),
                    gross_pay: Number(x.gross_pay),
                };
            }) || [];

        return { pay };
    },
});
