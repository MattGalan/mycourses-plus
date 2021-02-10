$(
  "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div:nth-child(1)"
).html("<h2>Upcoming Events</h2><div>Loading events...</div>");

const eventIcons = {
  Assignment: chrome.extension.getURL("/images/book-open.svg"),
  Quiz: chrome.extension.getURL("/images/feather.svg"),
  "Office Hours": chrome.extension.getURL("/images/life-buoy.svg"),
  Lecture: chrome.extension.getURL("/images/video.svg"),
};

chrome.runtime.sendMessage(
  { type: "calendar", token: localStorage["XSRF.Token"] },
  function (response) {
    const container = $(
      "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div:nth-child(2)"
    );

    container.html(`
      <h2>Upcoming Events</h2>
    `);

    response.forEach((eventGroup) => {
      const newGroup = $(
        `<div class="mcp-event-group"><h3>${eventGroup.date}</h3></div>`
      );
      eventGroup.events.forEach((e) => {
        newGroup.append(`
          <a class="mcp-event" href=${e.href}>
            <span class="mcp-event-header">
              <img src="${eventIcons[e.type]}" title="${e.type}"/>
              <span>${e.time}</span>
            </span>
            <span class="mcp-event-title">${e.title}</span>
          </div>
        `);
      });
      container.append(newGroup);
    });
  }
);
