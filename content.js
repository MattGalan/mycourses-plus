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

// Get class ID from URL
const classID = window.location.href.match(/\d{6}/)[0];

// Construct class object
const classObj = {
  title: classTitle,
  url: window.location.href,
  id: classID,
};

// Create custom nav bar
const navPlus = document.createElement("div");
navPlus.className = "mycourses-plus-nav";

// Add MCP logo
const logoElement = document.createElement("img");
logoElement.src = chrome.extension.getURL("/images/get_started128.png");
navPlus.appendChild(logoElement);

function createDropdownLink(name) {
  const newDropdownLink = document.createElement("a");
  newDropdownLink.textContent = name;
  return newDropdownLink;
}

// Inject class quick links
chrome.storage.sync.get(["savedClasses"], (result) => {
  result.savedClasses.forEach((curClass) => {
    const newClass = document.createElement("div");
    newClass.className = "mcp-class";

    const newLink = document.createElement("a");
    newLink.textContent = curClass.title;
    newLink.href = curClass.url;
    newLink.className = "mcp-class-link";

    newDropdown = document.createElement("div");
    newDropdown.className = "mcp-class-dropdown";

    const newDropdownContent = document.createElement("div");
    newDropdownContent.className = "mcp-class-dropdown-content";

    newDropdownContent.appendChild(createDropdownLink("Content"));
    newDropdownContent.appendChild(createDropdownLink("Assignments"));
    newDropdownContent.appendChild(createDropdownLink("Quizzes"));
    newDropdownContent.appendChild(createDropdownLink("Grades"));

    newUnsaveButton = document.createElement("button");
    newUnsaveButton.textContent = "Remove from quick bar";
    newUnsaveButton.onclick = () => {
      chrome.storage.sync.set({
        savedClasses: result.savedClasses.filter(
          (saved) => saved.id !== curClass.id
        ),
      });
      location.reload();
      return false;
    };
    newDropdownContent.appendChild(newUnsaveButton);

    newDropdown.appendChild(newDropdownContent);
    newClass.appendChild(newLink);
    newClass.appendChild(newDropdown);
    navPlus.appendChild(newClass);
  });
});

// Add "save class" button if not already saved
chrome.storage.sync.get(["savedClasses"], (result) => {
  if (!result.savedClasses.find((c) => c.id === classID)) {
    const { savedClasses } = result;

    // Create button
    const saveClassButton = document.createElement("button");
    saveClassButton.className = "mcp-add-button";
    saveClassButton.textContent = `Add ${classTitle} to quick bar`;

    // Save class when button is clicked
    saveClassButton.onclick = () => {
      if (!savedClasses) {
        // No saved classes array
        chrome.storage.sync.set({ savedClasses: [classObj] });
      } else if (!savedClasses.find((c) => c.title === classTitle)) {
        // This class hasn't been saved
        chrome.storage.sync.set({
          savedClasses: [...savedClasses, classObj],
        });

        // Refresh page
        location.reload();
        return false;
      }
    };

    // Inject "save class" button
    classTitle && navPlus.appendChild(saveClassButton);
  }
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
