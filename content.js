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
