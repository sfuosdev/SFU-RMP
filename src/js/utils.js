import { JSDOM } from "jsdom";

export const createDOM = (html) => {
    const doc = new JSDOM(html).window.document;
    return doc;
}

export const wait = (interval) => new Promise((resolve, _) => setTimeout(resolve, interval));

export const fetchWithRetries = (url, requestConfig, retryConfig = {}) => {
    const retry = retryConfig.retry ? retryConfig.retry : 5;
    const interval = retryConfig.interval ? retryConfig.interval : 500;
    return fetch(url, requestConfig).catch(err => {
        const retryLeft = retry - 1;
        if (!retryLeft)
            throw err;
        console.error(`Request failed: URL=${url}, retry left: ${retryLeft}`);
        return wait(interval).then(() => fetchWithRetries(url, requestConfig, { retry: retryLeft, interval: interval }));
    });
}

export const PROMISE_WINDOW_SIZE = {
    SMALL: 5,
    MEDIUM: 10,
    LARGE: 15
}

/**
 * @param {Number} windowSize 
 * @param {Array} iterable 
 * @param {(param) => Promise} promiseGenerator 
 */
export const promiseWindow = async (windowSize, iterable, promiseGenerator) => {
    if (windowSize < 1)
        throw new Error("Window size must be bigger than 0");
    let pointer = 0;
    let accumulator = [];
    while (pointer < iterable.length) {
        const window = Math.min(windowSize, iterable.length - pointer);
        const items = iterable.slice(pointer, pointer+window);
        pointer = pointer + windowSize;
        await Promise.all(items.map(item => promiseGenerator(item))).then(res => accumulator = [...accumulator, res]);
    }
    return accumulator.flat(Infinity);
}