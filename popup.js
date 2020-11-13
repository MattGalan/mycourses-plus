"use strict";

// const changeColor = document.getElementById("changeColor");

// // Set up our button's background color and value
// browser.storage.sync.get("color", function (data) {
//   changeColor.style.backgroundColor = data.color;
//   changeColor.setAttribute("value", data.color);
// });

// changeColor.onclick = function (element) {
//   let color = element.target.value;
//   browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     browser.tabs.executeScript(tabs[0].id, {
//       code: 'document.body.style.backgroundColor = "' + color + '";',
//     });
//   });
// };

const checkboxHide = document.getElementById("checkboxHide");

browser.storage.sync.get(["doHide"], (result) => {
  checkboxHide.checked = result.doHide;
});

checkboxHide.onchange = (e) => {
  browser.storage.sync.set({ doHide: e.target.checked });
};
