function hideElement(path) {
  const el = document.querySelector(path);
  el?.parentElement?.removeChild(el);
}

// Remove useless panels
const elementsToHide = [
  // Instructions panel
  "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-8 > div:nth-child(1)",
  // User links
  "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div:nth-child(1)",
];
elementsToHide.forEach((path) => hideElement(path));

// Remove nav footer if on home page
if (window.location.href === "https://mycourses.rit.edu/d2l/home") {
  hideElement(
    "body > header > nav > d2l-navigation > d2l-navigation-main-footer"
  );
}

// Get class title
const classTitle = document
  .querySelector(
    "body > header > nav > d2l-navigation > d2l-navigation-main-header > div.d2l-navigation-header-left > div.d2l-navigation-s-header-logo-area > div > a"
  )
  ?.textContent?.match(/^\w*\.\d*/)[0];

const classObj = {
  title: classTitle,
  url: window.location.href,
};

// Create custom nav bar
const navPlus = document.createElement("div");
navPlus.className = "mycourses-plus-nav";

// Add MCP logo
const logoElement = document.createElement("img");
logoElement.src = chrome.extension.getURL("/images/get_started128.png");
navPlus.appendChild(logoElement);

// Add add button
const addButton = document.createElement("button");
addButton.className = "mcp-add-button";
addButton.textContent = `+ ${classTitle}`;

// Save class when add button is clicked
addButton.onclick = () => {
  chrome.storage.sync.get(["savedClasses"], (result) => {
    const { savedClasses } = result;
    if (!savedClasses) {
      // No saved classes array
      chrome.storage.sync.set({ savedClasses: [classObj] });
      return;
    } else if (!savedClasses.find((c) => c.title === classTitle)) {
      // This class hasn't been saved
      chrome.storage.sync.set({ savedClasses: [...savedClasses, classObj] });
    }
  });
};

// Inject add button
classTitle && navPlus.appendChild(addButton);

// Inject class quick links
chrome.storage.sync.get(["savedClasses"], (result) => {
  result.savedClasses.forEach((c) => {
    const newLink = document.createElement("a");
    newLink.textContent = c.title;
    newLink.href = c.url;
    newLink.className = "mcp-class-link";
    navPlus.appendChild(newLink);
  });
});

// Put navPlus in a container so it lines up with the real nav
const navPlusContainer = document.createElement("div");
navPlusContainer.className = "mcp-nav-container";
navPlusContainer.appendChild(navPlus);

// Inject custom nav bar
const nav = document.querySelector("body > header > nav > d2l-navigation");
nav.insertBefore(
  navPlusContainer,
  document.querySelector(
    "body > header > nav > d2l-navigation > d2l-navigation-main-footer"
  )
);
