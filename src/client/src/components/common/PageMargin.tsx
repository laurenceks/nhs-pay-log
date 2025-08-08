import { ReactNode } from "react";

const PageMargin = ({ children }: { children: ReactNode }) => (
    <div className="p-3 minh-100">{children}</div>
);
export default PageMargin;
