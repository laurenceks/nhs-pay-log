import { fetchJson, publicFetchJson } from "./queryUtils";
import { ClientUser } from "../../../../types/commonTypes";
import { queryOptions } from "@tanstack/react-query";

export const getRegisterOptionsFetch = async () => {
    return await publicFetchJson<{ pay_group_id: string; label: string }[]>(
        "/api/v1/public/register"
    );
};
export const getVerifyFetch = async (selector: string, token: string) => {
    return await publicFetchJson(
        `/api/v1/public/verify?selector=${selector}&token=${token}`
    );
};

export const getRegisterOptionsQueryOptions = queryOptions({
    queryKey: ["registerOptions"],
    queryFn: getRegisterOptionsFetch,
});
export const getVerifyQueryOptions = (selector: string, token: string) =>
    queryOptions({
        queryKey: ["verify", selector],
        queryFn: () => getVerifyFetch(selector, token),
    });

export const postLoginFetch = async (body: {
    email: string;
    password: string;
}) => {
    return await publicFetchJson<ClientUser>(
        "/api/v1/public/login",
        "POST",
        body
    );
};
export const postRegisterFetch = async (body: {
    email: string;
    password1: string;
    password2: string;
    employment_name: string;
    employment_from: string;
    pay_group_id: string;
    weekly_hours: number;
    pension_perc: number;
    student_loan: "" | 1 | 2 | 4 | 5 | 6;
}) => {
    return await publicFetchJson("/api/v1/public/register", "POST", body);
};
export const postVerifyFetch = async (body: { email: string }) => {
    return await publicFetchJson("/api/v1/public/verify", "POST", body);
};
export const postForgotFetch = async (body: { email: string }) => {
    return await publicFetchJson("/api/v1/public/forgot", "POST", body);
};
export const patchForgotFetch = async ({
    formState,
    selector,
    token,
}: {
    formState: {
        email: string;
        newPassword1: string;
        newPassword2: string;
    };
    selector: string;
    token: string;
}) => {
    return await publicFetchJson(
        `/api/v1/public/forgot?selector=${selector}&token=${token}`,
        "PATCH",
        formState
    );
};
export const getLoginFetch = async () => {
    return await fetchJson<ClientUser>("/api/v1/public/login");
};
