import * as bundle from "../browserify/jsdom.bundle.js";

/**
 * @returns {Boolean} return true if the current running environment is browser, false otherwise
 */
export const isBrowser = () => {
    return !(typeof process === "object" && typeof require === "function");
}

export const createRequestHeader = (config) => {
    return {
        headers: {
            "User-Agent": "SFU_RMP"
        },
        ...config
    }
}

export const isValidUrl = (string) => {
    try {
        const url = new URL(string);
    } catch (err) {
        throw new Error(`Invalid url given: ${string}`);
    }
}

export function waitFor(conditionFunction) {
    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 200);
    }  
    return new Promise(poll);
}
  

/**
 * 
 * @param {String} url 
 * @param {Object} waitForSelector (Optional), wait until a specific query selector presnent, for client-side rendering
 * @returns raw HTML string
 */
export const downloadHTMLFromURL = async (url) => {
    const html = await fetchWithRetries(url, createRequestHeader()).then(res => res.text());
    return html;
}

export const createDOM = (html) => {
    const jsdom = isBrowser() ? jsdomModule.jsdom : require('jsdom');
    const doc = new jsdom.JSDOM(html).window.document;
    return doc;
}

export const fetchWithRetries = (url, requestConfig, retryConfig = {}) => {
    const retry = retryConfig.retry ? retryConfig.retry : 5;
    const interval = retryConfig.interval ? retryConfig.interval : 500;
    const wait = (interval) => new Promise((resolve, _) => setTimeout(resolve, interval));

    return fetch(url, requestConfig).catch(err => {
        const retryLeft = retry - 1;
        if (!retryLeft)
            throw err;
        return wait(interval).then(() => fetchWithRetries(url, requestConfig, { retry: retryLeft, interval: interval }));
    });
}

export const PROMISE_WINDOW_SIZE = {
    SMALL: 5,
    MEDIUM: 10,
    LARGE: 20
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