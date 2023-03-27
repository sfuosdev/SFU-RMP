(async () => {
    const src = chrome.runtime.getURL('src/js/contentScripts/mySchedule.js');
    const script = await import(src);
    script.render();
})();