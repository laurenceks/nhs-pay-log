import { formatDate } from "../utils/formatDates";

export const nextPayDate = (date: string | Date, t = 24): Date => {
    const p = typeof date === "string" ? new Date(date) : date;
    p.setMonth(p.getMonth() + 1);
    p.setDate(t);
    if (p.getDay() === 0 || p.getDay() === 6) {
        p.setDate(p.getDate() - (p.getDay() ? 1 : 2));
    }
    return p;
};
export const flowersPayMonth = (date: string | Date): string => {
    const f = typeof date === "string" ? new Date(date) : date;
    f.setMonth(f.getMonth() + 2);
    return formatDate(f, "yy-mm");
};
export const financialYear = (date: string | Date) => {
    const f = typeof date === "string" ? new Date(date) : date;
    const y = f.getFullYear(),
        m = f.getMonth() + 1,
        d = f.getDate();
    const firstYear = m > 4 || (m === 4 && d >= 6) ? y : y - 1;
    return `${firstYear.toString().slice(-2)}-${(firstYear + 1).toString().slice(-2)}`;
};
