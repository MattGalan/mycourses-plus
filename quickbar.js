/**
 * Example:    SWEN.340.01S1 - SW Design for Computing Sys (SWEN34001S1.2201)
 * Short code: SWEN.340
 * Long code:  SWEN.340.01S1
 * ID:         857634
 */

// Grab the text from the big class header on the page
headerText = $(
  "body > header > nav > d2l-navigation > d2l-navigation-main-header > div.d2l-navigation-header-left > div.d2l-navigation-s-header-logo-area > div > a"
).text();

// Extract short and long codes from header
const shortCode = headerText?.match(/^\w*\.\d*/)?.[0];
const longCode = headerText?.match(/^(.*) -/)?.[1];

function getPreferredCode(savedClasses, classObj, threshold) {
  return savedClasses.filter((c) => c.shortCode === classObj.shortCode)
    .length >= threshold
    ? classObj.longCode
    : classObj.shortCode;
}

// Get class ID from URL
let id;
const urlMatches = location.href.match(/\d{6}/);
if (urlMatches?.length === 1) {
  // Only found one 6 digit number, so we know it's the class ID
  id = urlMatches[0];
} else if (urlMatches?.length > 1) {
  // Found multiple 6 digit numbers, so we need to be more specific
  id = location.href.match(/ou=(\d{6})/)[1];
}

// Create custom nav bar
const quickBar = document.createElement("div");
quickBar.className = "mcp-quick-bar";

// Add MCP logo
const logoElement = document.createElement("img");
logoElement.src = chrome.extension.getURL("/images/get_started128.png");
quickBar.appendChild(logoElement);

function createDropdownLink(name, href) {
  const newDropdownLink = document.createElement("a");
  newDropdownLink.textContent = name;
  newDropdownLink.href = href;
  return newDropdownLink;
}

// Inject class quick links
chrome.storage.sync.get(["savedClasses"], (result) => {
  result.savedClasses?.forEach((c) => {
    // prettier-ignore
    $(quickBar).append(`
      <div class="mcp-class">
        <a href="https://mycourses.rit.edu/d2l/home/${c.id}">${getPreferredCode(result.savedClasses, c, 2)}</a>
        <div class="mcp-class-dropdown">
          <div class="mcp-class-dropdown-content">
            <a href="https://mycourses.rit.edu/d2l/le/content/${c.id}/Home">
              Content
            </a>
            <a href="https://mycourses.rit.edu/d2l/lms/dropbox/user/folders_list.d2l?ou=${c.id}&isprv=0">
              Assignments
            </a>
            <a href="https://mycourses.rit.edu/d2l/lms/quizzing/user/quizzes_list.d2l?ou=${c.id}">
              Quizzes
            </a>
            <a href="https://mycourses.rit.edu/d2l/lms/grades/my_grades/main.d2l?ou=${c.id}">
              Grades
            </a>
            <button class="mcp-class-remove">
              Remove from quick bar
            </button>
          </div>
        </div>
      </div>
    `);
  });
});

chrome.storage.sync.get(["savedClasses"], (result) => {
  const { savedClasses } = result;

  $(".mcp-class-remove").each(function (index) {
    this.onclick = () => {
      chrome.storage.sync.set({
        savedClasses: savedClasses.filter(
          (saved) => saved.id !== savedClasses[index].id
        ),
      });
      location.reload();
      return false;
    };
  });
});

// Add "save class" button if not already saved
chrome.storage.sync.get(["savedClasses"], (result) => {
  if (id && !result.savedClasses?.find((c) => c.id === id)) {
    const { savedClasses } = result;

    // Construct class object
    const classObj = {
      id,
      shortCode,
      longCode,
    };

    // Create button
    const saveClassButton = document.createElement("button");
    saveClassButton.className = "mcp-add-button";
    saveClassButton.textContent = `Add ${getPreferredCode(
      savedClasses,
      classObj,
      1
    )} to quick bar`;

    // Save class when button is clicked
    saveClassButton.onclick = () => {
      if (!savedClasses) {
        // No saved classes array
        chrome.storage.sync.set({ savedClasses: [classObj] });
      } else if (!savedClasses.find((c) => c.id === id)) {
        // This class hasn't been saved
        chrome.storage.sync.set({
          savedClasses: [...savedClasses, classObj],
        });
      }

      // Refresh page
      location.reload();
      return false;
    };

    // Inject "save class" button
    quickBar.appendChild(saveClassButton);
  }
});

// Put quickBar in a container so it lines up with the real nav
const quickBarContainer = document.createElement("div");
quickBarContainer.className = "mcp-quick-bar-container";
quickBarContainer.appendChild(quickBar);

// Inject custom nav bar
const nav = document.querySelector("body > header > nav > d2l-navigation");
nav.insertBefore(
  quickBarContainer,
  document.querySelector(
    "body > header > nav > d2l-navigation > d2l-navigation-main-footer"
  )
);
