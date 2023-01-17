(async () => {
    const src = chrome.runtime.getURL('src/renderer.js');
    const script = await import(src);
    script.render();
})();