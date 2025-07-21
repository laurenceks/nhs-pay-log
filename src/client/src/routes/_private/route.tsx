import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { stripQueryOptionsForEnsureQuery } from "../../queries/queryUtils";
import { getExtrasQueryOptions } from "../../queries/extraQueries";
import { ShiftExtra } from "../../../../../types/commonTypes";
import { getPayBandsQueryOptions } from "../../queries/payBandQueries";
import { PayBand } from "../../../../../types/lookupTypes";
import Cookies from "js-cookie";

export const Route = createFileRoute("/_private")({
    component: Outlet,
    loader: async ({ context }) => {
        const extras =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getExtrasQueryOptions)
                )
            ).data.map((x: ShiftExtra) => ({
                ...x,
                value: parseInt(x.value as string, 10),
            })) || [];

        const payBands =
            (
                await context.queryClient.ensureQueryData(
                    stripQueryOptionsForEnsureQuery(getPayBandsQueryOptions)
                )
            ).data.map((x: PayBand) => ({
                ...x,
                pay_hourly: Number(x.pay_hourly),
                pay_monthly: Number(x.pay_monthly),
                pay_annually: Number(x.pay_annually),
            })) || [];

        return { extras, payBands };
    },

    beforeLoad: async ({ context }) => {
        if (!Cookies.get("sessionExpiry") || !(await context.auth?.isAuth())) {
            window.localStorage.setItem(
                "redirect",
                location.pathname + location.hash + location.search
            );
            context.auth?.logout();
            throw redirect({
                to: "/login",
            });
        }
    },
});
