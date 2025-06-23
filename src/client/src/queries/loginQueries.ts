import { fetchJson } from "./queryUtils";
import { ClientUser } from "../../../../types/commonTypes";

export const postLogin = async (body: { email: string; password: string }) => {
    return await fetchJson<ClientUser>("/api/v1/public/login", "POST", body);
};
export const postRegister = async (body: {
    email: string;
    password1: string;
    password2: string;
}) => {
    return await fetchJson<ClientUser>("/api/v1/public/register", "POST", body);
};
export const getLogin = async () => {
    return await fetchJson<ClientUser>("/api/v1/public/login");
};
