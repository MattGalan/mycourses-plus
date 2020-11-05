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

// Replace full course names, such as "IMGS.111.01/L1-L4 - Imaging Science Fundamentals"
// with short course names, such as "IMGS.111"
$(
  "ul > li > div.d2l-datalist-item-content > div > div.d2l-inline > div.d2l-textblock:nth-child(3)"
).each(function () {
  this.textContent = this.textContent.match(/^\w{4}\.\d{3}/)[0];
});
