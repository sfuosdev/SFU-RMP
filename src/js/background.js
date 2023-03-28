import Message from "./models/Message.js";
import { checkCourseListPresentInStorage, checkProfessorRatingDictionaryPresentInStorage, saveCourseListInLocalStorage, saveProfessorRatingDictionary } from "./storage.js";
import { createRequestHeader, downloadHTMLFromURL } from "./web/utils.js";

async function isInitialSetupRequired() {
  const condition = await checkCourseListPresentInStorage() 
    && await checkProfessorRatingDictionaryPresentInStorage();
  return !condition;
}

function markExtensionReadyToRun() {
  chrome.action.setIcon({
    path: {
      "16": "/images/sfu_rmp_logo16.png",
      "32": "/images/sfu_rmp_logo32.png",
    }
  });
}

let loadingSandboxTab;
function openLoadingSandbox() {
  if(!loadingSandboxTab)
    chrome.tabs.create({url: "../../loading.html"}, (tab) => loadingSandboxTab = tab);
  else
    chrome.tabs.get(loadingSandboxTab.id)
    .then((tab) => {
      // Focus existing loading page
      chrome.tabs.highlight({'tabs': tab.index}, function() {});
    })
    .catch(() => {
      // No loaindg page found, create a new one
      chrome.tabs.create({url: "../../loading.html"}, (tab) => loadingSandboxTab = tab);
    });
}

function startInitialSetup() {
  openLoadingSandbox();
}

isInitialSetupRequired().then(flag => {
  if(flag)
    startInitialSetup();
  else
    markExtensionReadyToRun();
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type && request.type === "sandbox_message") {
    switch (request.key) {
      case "courseInfo":
        saveCourseListInLocalStorage(request.message);
        break;
      case "professorRatingInfo":
        saveProfessorRatingDictionary(request.message);
        break;
      case "yieldFetchOnServiceWorker":
        const { identifier, url } = request.message;
        downloadHTMLFromURL(url, createRequestHeader()).then(html => 
          chrome.runtime.sendMessage(new Message("background_message", "yieldFetchOnServiceWorker_response", { identifier, result: html }))  
        );
        break;
      case "loadingCompletion":
        markExtensionReadyToRun();
        break;
    }
  }

  if (request.type && request.type === "popup_message") {
    switch(request.key) {
      case "isBackgroundTaskRequired":
        isInitialSetupRequired().then(flag => {
          sendResponse(new Message("background_message", "isBackgroundTaskRequired_response", flag));
        });
        return true;
      case "resetExtension":
        openLoadingSandbox();
        break;
    }
  }
});