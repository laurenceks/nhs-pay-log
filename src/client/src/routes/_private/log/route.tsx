import { createFileRoute } from "@tanstack/react-router";
import mockLogData from "../../../../../../tests/data/mockLogData";
import Log from "../../../components/log/Log";
import { memo } from "react";

export const Route = createFileRoute("/_private/log")({
    component: memo(Log),
    loader: async () => {
        console.log("Fetching log...");
        // simulates an api call to get entire log
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        console.log("...done!");
        return mockLogData;
    },
    shouldReload: ({ params }) => {
        return !Object.keys(params).length;
    },
    pendingMs: 0,
});
