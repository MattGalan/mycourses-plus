function onPageLoadHideNavElements() {
  // Get the header div.
  var navBar = $(
    "body > header > nav > d2l-navigation > d2l-navigation-main-footer > div > div"
  );

  // Look up list of of navItemsToHide = ["Starfish", "Discussions", "Classlist", "Calendar"]
  chrome.storage.sync.get(["navItemsToHide"], (result) => {
    const { navItemsToHide } = result;

    if (navItemsToHide == undefined) {
      chrome.storage.sync.set({ navItemsToHide: [] });
      return;
    }

    navBar.children().each(function (i, navDiv) {
      var navText = navDiv.children[0].innerText;

      // Hide all nav items contained in navItemsToHide.
      if (navItemsToHide.includes(navText.replace(/\s/g, ""))) {
        navDiv.style.display = "none";
      }
    });
  });
}

function injectHideMenu() {
  // Create empty skeleton of hide menu.
  var hideDivNavMenu = document.createElement("div");

  var html =
    '<div class="d2l-navigation-s-item" role="listitem">' +
    "<d2l-dropdown>" +
    '<button class="d2l-navigation-s-group d2l-dropdown-opener" aria-haspopup="true" aria-expanded="false">' +
    '<span class="d2l-navigation-s-group-wrapper">' +
    '<span class="d2l-navigation-s-group-text">' +
    "Hide" +
    "</span>" +
    '<d2l-icon icon="d2l-tier1:chevron-down" dir="ltr"></d2l-icon>' +
    "</span>" +
    "</button>" +
    '<d2l-dropdown-menu render-content="render-content" dir="ltr" no-auto-focus="" no-padding="" dropdown-content="" id="hide-menu">' +
    '<d2l-menu label="Hide" class="d2l-menu-mvc" active="" aria-label="Hide" role="menu">' +
    "</d2l-menu>" +
    "</d2l-dropdown-menu></d2l-dropdown>" +
    "</div>";

  hideDivNavMenu.innerHTML = html;

  // Add hide menu to beginning of the nav menu.
  $(".d2l-navigation-s-main-wrapper")?.[0]?.prepend(hideDivNavMenu.firstChild);

  // Exclude certain menus that are present but need not be hideable.
  var excludedNavBars = ["More", "Hide", "", " ", null];

  // For each nav item found on the page, add each entry to the hide menu.
  var navBar = $(
    "body > header > nav > d2l-navigation > d2l-navigation-main-footer > div > div"
  );
  navBar.children().each(function (i, navDiv) {
    var navText = navDiv.children[0].innerText;

    if (!excludedNavBars.includes(navText)) {
      // Create id to query later on.
      var id = "hide-menu-" + navText.replace(/\s/g, "");

      $("#hide-menu").append(`
        <d2l-menu-item
          text="${navText}"
          class="d2l-navigation-s-menu-item-root"
          id="${id}"
          role="menuitem"
          tabindex="0"
          aria-disabled="false"
          first="true"
        />
      `);

      // Register click handler.
      $("#" + id).click(function () {
        onClickToggleNavVisibility(navText);
      });
    }
  });
}

function onClickToggleNavVisibility(navName) {
  chrome.storage.sync.get(["navItemsToHide"], (result) => {
    const { navItemsToHide } = result;

    const classObj = navName.replace(/\s/g, "");

    if (!navItemsToHide.includes(classObj)) {
      // Hide nav item
      if (!navItemsToHide) {
        // If list is empty create new one with 1 entry.
        chrome.storage.sync.set({ navItemsToHide: [classObj] });
      } else {
        chrome.storage.sync.set({
          // Add navName to navItemsToHide
          navItemsToHide: [...navItemsToHide, classObj],
        });
      }
    } else {
      // Remove nav item from navItemsToHide, as it now needs to be displayed
      navItemsToHide.remove(classObj);
      chrome.storage.sync.set({ navItemsToHide: navItemsToHide });
    }

    // Toggle the nav item locally so the user need not reload.
    toggleNavItem(navName);
  });
}

function toggleNavItem(navName) {
  // Get the header div.
  var navBar = $(
    "body > header > nav > d2l-navigation > d2l-navigation-main-footer > div > div"
  );

  navBar.children().each(function (i, navDiv) {
    var navText = navDiv.children[0].innerText;

    // Toggle nav item display
    if (navText.replace(/\s/g, "") == navName.replace(/\s/g, "")) {
      if (navDiv.style.display == "none") {
        navDiv.style.display = "block";
      } else {
        navDiv.style.display = "none";
      }
    }
  });
}

// Helper function for removing specifc items from arrays.
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

$(document).ready(function () {
  onPageLoadHideNavElements();
  injectHideMenu();
});
