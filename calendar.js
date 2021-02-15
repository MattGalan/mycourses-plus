$(
  "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div:nth-child(1)"
).html("<h2>Upcoming Events</h2><div>Loading events...</div>");

let hideZoom = false;

const eventIcons = {
  Assignment: chrome.extension.getURL("/images/book-open.svg"),
  Quiz: chrome.extension.getURL("/images/feather.svg"),
  "Office Hours": chrome.extension.getURL("/images/life-buoy.svg"),
  Lecture: chrome.extension.getURL("/images/video.svg"),
};

const buttonStyles = {
  backgroundColor: '#f76902',
  border: 'none',
  color: 'white',
  textAlign: 'center',
  padding: '10px 10px',
  cursor: 'pointer'
}

function toggleZoom() {
  hideZoom = !hideZoom;
  loadUpcomingEvents();
}

function loadUpcomingEvents() {
  chrome.runtime.sendMessage(
    { type: "calendar", token: localStorage["XSRF.Token"] },
    function (response) {
      const container = $(
        "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div:nth-child(2)"
      );

      container.html(`
        <h2>Upcoming Events</h2>
        <button id=\"toggleZoom\" \"type=\"button\"> Toggle Zoom Meetings </button>
      `);

      const buttonElement = document.getElementById("toggleZoom");
      // Add button event handlders
      buttonElement.onmousedown = function() {buttonElement.style.backgroundColor = '#c55300';}
      buttonElement.onmouseup = function() {buttonElement.style.backgroundColor = '#f76902';}
      document.getElementById("toggleZoom").onmouseleave = function() {
        buttonElement.style.backgroundColor = '#f76902';
        buttonElement.style.outline = 'none'
      }
      buttonElement.onmouseover = function() {buttonElement.style.outline = '2px solid black'}
      buttonElement.onclick = function() { toggleZoom() };
      // Add Button styles
      for (const [styleName, value] of Object.entries(buttonStyles)) {
        buttonElement.style[styleName] = value;
      }

      response.forEach((eventGroup) => {
        const newGroup = $(
          `<div class="mcp-event-group"><h3><u>${eventGroup.date}</u></h3></div>`
        );
        let eventCount = 0;
        eventGroup.events.forEach((e) => {
          // Omit event if wanting to hide Zoom meetings, and event is a lecture or office hours 
          if (hideZoom && (e.type == "Lecture" || e.type == "Office Hours")) {
            return;
          }
          console.log(e)
          newGroup.append(`
            <a class="mcp-event" href=${e.href}>
              <span class="mcp-event-header">
                <img src="${eventIcons[e.type]}" title="${e.type}"/>
                <span>${e.time}</span>
              </span>
              <span class="mcp-event-title"><b>${e.course.substring(0, e.course.search(' - '))}</b></span>
              <span class="mcp-event-title">${e.title}</span>
            </div>
          `);
          eventCount++;
        });

        if (eventCount > 0) {
          container.append(newGroup);
        }
        eventCount = 0;
      });
    }
  );
}

loadUpcomingEvents(hideZoom);