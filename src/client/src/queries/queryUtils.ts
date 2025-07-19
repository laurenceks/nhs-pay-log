import {
    EnsureQueryDataOptions,
    QueryKey,
    QueryOptions,
} from "@tanstack/react-query";
import { ApiResponse } from "../../../../types/responseTypes";
import { queryClient } from "../App";

export const publicFetchJson = async <T = undefined>(
    url: string,
    method = "GET",
    body?: object
): Promise<ApiResponse<T>> => {
    return await fetchJson(url, method, body, true);
};

export const fetchJson = async <T = undefined>(
    url: string,
    method = "GET",
    body?: object,
    ignoreUnauthorised?: boolean
): Promise<ApiResponse<T>> => {
    const res = await fetch(url, {
        method: method,
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "same-origin",
        body: body ? JSON.stringify(body) : undefined,
    });
    const json: ApiResponse<T> = await res.json();
    if (!res.ok) {
        if ((res.status === 401 || res.status === 403) && !ignoreUnauthorised) {
            //force reload to login page
            window.localStorage.setItem(
                "redirect",
                window.location.pathname +
                    window.location.hash +
                    window.location.search
            );
            window.location.href = "/login";
            //stall logic to prevent error registering before the redirect
            return new Promise(() => {});
        } else {
            throw { ...new Error(json.message), status: res.status, ...json };
        }
    }
    return json;
};
export const fetchLogout = async (): Promise<ApiResponse> => {
    const res = await fetch("/api/v1/public/logout", {
        method: "GET",
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "same-origin",
        cache: "no-store",
    });
    await queryClient.invalidateQueries();
    const json: ApiResponse = await res.json();
    if (!res.ok) {
        throw { ...new Error(json.message), status: res.status, ...json };
    }
    return json;
};

export const stripQueryOptionsForEnsureQuery = <
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    opts: Pick<
        QueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        "queryKey" | "queryFn"
    >
): EnsureQueryDataOptions<TQueryFnData, TError, TData, TQueryKey> => {
    if (!opts.queryKey) {
        throw new Error("queryKey is required for ensureQueryData");
    }
    return {
        queryKey: opts.queryKey,
        queryFn: opts.queryFn,
    };
};
