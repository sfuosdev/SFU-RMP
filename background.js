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