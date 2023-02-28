(async () => {
    const src = chrome.runtime.getURL('src/js/mySchedule.js');
    const script = await import(src);
    script.render();
})();