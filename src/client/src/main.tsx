import { StrictMode } from "react";
import "./style.scss";
import { createRoot } from "react-dom/client";
import App from "./App";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
