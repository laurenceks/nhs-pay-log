import { fetchJson } from "./queryUtils";
import { ClientUser } from "../../../../types/commonTypes";
import { queryOptions } from "@tanstack/react-query";

export const getRegisterOptionsFetch = async () => {
    return await fetchJson<{ pay_group_id: string; label: string }[]>(
        "/api/v1/public/register"
    );
};

export const getRegisterOptionsQueryOptions = queryOptions({
    queryKey: ["registerOptions"],
    queryFn: getRegisterOptionsFetch,
});

export const postLoginFetch = async (body: {
    email: string;
    password: string;
}) => {
    return await fetchJson<ClientUser>("/api/v1/public/login", "POST", body);
};
export const postRegisterFetch = async (body: {
    email: string;
    password1: string;
    password2: string;
    employment_name: string;
    employment_from: string;
    pay_group_id: string;
    weekly_hours: number;
}) => {
    return await fetchJson("/api/v1/public/register", "POST", body);
};
export const getLoginFetch = async () => {
    return await fetchJson<ClientUser>("/api/v1/public/login");
};
