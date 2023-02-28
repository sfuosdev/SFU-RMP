// Query control button
let changeColor = document.getElementById("changeColor");

// When the button is clicked, inject text element
changeColor.addEventListener("click", async () => {
  const wrapper = document.getElementById("wrapper");
  const text = document.createElement("p");
  text.innerText = "Hello World!";
  
  wrapper.appendChild(text);
});

var stat = 1;
let status1btn = document.getElementById("status1btn");
let status2btn = document.getElementById("status2btn");


// When the button is clicked, inject text element
status1btn.addEventListener("click", async () => {
  stat = 1;
  // document.getElementById("element").style.display = "none";
  // document.getElementById("element").style.display = "block";
  console.log("check btn 1")
  const pElement = document.getElementById("status");
  pElement.innerText = stat;
});

// When the button is clicked, inject text element
status2btn.addEventListener("click", async () => {
  stat = 2;
  // document.getElementById("element").style.display = "none";
  // document.getElementById("element").style.display = "block";
  console.log("check btn 2")
  const pElement = document.getElementById("status");
  pElement.innerText = stat;
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
