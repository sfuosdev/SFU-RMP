(async () => {
    const src = chrome.runtime.getURL('src/js/renderer.js');
    const script = await import(src);
    script.render();
})();