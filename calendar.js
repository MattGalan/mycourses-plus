// Remove the fold that expands a mini calendar
$("div.d2l-collapsepane")[0].remove();

// Remove the "upcoming events" header
$("div > div > div.d2l-collapsepane-header").remove();

// Remove the little chevron to the right of "Calendar"
$(
  "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div:nth-child(1) > div > div.d2l-homepage-header-menu-wrapper"
).remove();

// Remove padding from calendar widget.
// For more styling see calendar.css
$($(".d2l-widget.d2l-tile")[3]).css("padding", 0);
