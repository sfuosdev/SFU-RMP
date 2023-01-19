// Query control button
let changeColor = document.getElementById("changeColor");

// When the button is clicked, inject text element
changeColor.addEventListener("click", async () => {
  const wrapper = document.getElementById("wrapper");
  const text = document.createElement("p");
  text.innerText = "Hello World!";
  
  wrapper.appendChild(text);
});

/*
// To access current page, not popup
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor,
  });
});

function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}
*/