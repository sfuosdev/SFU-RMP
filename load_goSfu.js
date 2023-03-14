chrome.runtime.sendMessage({ status: "completed" });

(async () => {
    const src = chrome.runtime.getURL('src/js/goSfu.js');
    const script = await import(src);
    script.render();
})();