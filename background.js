let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  //
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  console.log("page loaded");
  if (changeInfo.status == 'complete') {
    // run on every page load
  }
})

let currentStatus = "loading";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.status === "completed") {
    currentStatus = "completed";
    // Send a message to the popup script to update the status
    chrome.runtime.sendMessage({ status: currentStatus });
  } else if (message.getStatus) {
    // Send the current status to the popup script
    sendResponse({ status: currentStatus });
  }
});