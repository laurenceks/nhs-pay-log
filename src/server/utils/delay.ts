import sleep from "./sleep";

const delay = async (
    condition: boolean,
    trueFn: () => void | Promise<void>,
    minSleepMs: number = 300
): Promise<void> => {
    if (!condition) {
        await sleep(minSleepMs);
    } else {
        const start = Date.now();
        await trueFn();
        const duration = Date.now() - start;
        if (duration < minSleepMs) {
            await sleep(minSleepMs - duration);
        }
    }
    return;
};

export default delay;
