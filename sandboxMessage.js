let sandboxWindow = undefined;

window.addEventListener("message", event => {
    sandboxWindow = event.source;
    chrome.runtime.sendMessage(event.data); // message passing through to service worker from sandbox iframe
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (sandboxWindow)
        sandboxWindow.postMessage(request, '*');
});