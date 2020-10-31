"use strict";

// const changeColor = document.getElementById("changeColor");

// // Set up our button's background color and value
// chrome.storage.sync.get("color", function (data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute("value", data.color);
// });

// changeColor.onclick = function (element) {
//   let color = element.target.value;
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.executeScript(tabs[0].id, {
//       code: 'document.body.style.backgroundColor = "' + color + '";',
//     });
//   });
// };

const checkboxHide = document.getElementById("checkboxHide");

chrome.storage.sync.get(["doHide"], (result) => {
  checkboxHide.checked = result.doHide;
});

checkboxHide.onchange = (e) => {
  chrome.storage.sync.set({ doHide: e.target.checked });
};
