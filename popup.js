
/**
 * Check if initial setup is required in background service worker
 */
chrome.runtime.sendMessage({ type: "popup_message", key: "isBackgroundTaskRequired", message: null}, (response) => {
  console.log(response.message);
  if (response.message) showExtensionNotReady();
  else showExtensionReady();
});

function showExtensionReady() {
  const elesToShow = document.querySelectorAll(".extension_ready");
  const elesToHide = document.querySelectorAll(".extension_not_ready");
  elesToShow.forEach(ele => ele.style.display = "flex");
  elesToHide.forEach(ele => ele.style.display = "none");
}

function showExtensionNotReady() {
  const elesToShow = document.querySelectorAll(".extension_not_ready");
  const elesToHide = document.querySelectorAll(".extension_ready");
  elesToShow.forEach(ele => ele.style.display = "flex");
  elesToHide.forEach(ele => ele.style.display = "none");
}

const updateBtns = document.querySelectorAll("#extensionResetBtn");
updateBtns.forEach(btn => btn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "popup_message", key: "resetExtension", message: null});
}));