// export const logMessage = (message) => {
//   chrome.runtime.sendMessage({
//       target: "popup", 
//       message: message
//   });
// }
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//       if (request.target === "popup") {
//           //  show received log message on popup
//       }
//   }
// );

// Query control button
let status_one = document.getElementById("status_one");
let status_two = document.getElementById("status_two");

const wrapper = document.getElementById("wrapper");
let timeString = new Date().toLocaleTimeString();
let dateString = new Date().toDateString();

// When the button is clicked, inject text element
status_one.addEventListener("click", async () => {
  wrapper.innerHTML = "";
  const divOne = document.createElement("div")
  divOne.className = "div1";
  const data = document.createElement("h3");
  wrapper.appendChild(divOne);
  divOne.appendChild(data);
  data.innerText = "Collecting Data...";
});

status_two.addEventListener("click", async () => {
  wrapper.innerHTML = "";
  const divOne = document.createElement("div")
  divOne.className = "div2";
  const update = document.createElement("h3");
  update.innerText = "Last Update:";
  const time = document.createElement("h2");
  time.innerText = timeString;
  const date = document.createElement("p");
  date.innerText = dateString;
  wrapper.appendChild(divOne);
  divOne.appendChild(update);
  divOne.appendChild(time);
  divOne.appendChild(date);
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