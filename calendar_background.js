const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

function sameDate(a, b) {
  return a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getSemanticDate(date) {
  if (sameDate(date, today)) {
    return "Today";
  }

  if (sameDate(date, tomorrow)) {
    return "Tomorrow";
  }

  return daysOfWeek[date.getDay()];
}

function getEventTypeAndTitle(title) {
  if (title.includes(" - Due")) {
    return {
      type: "Assignment",
      title: title.slice(0, -6),
    };
  }

  if (title.includes(" - Availability Ends")) {
    return {
      type: "Quiz",
      title: title.slice(0, -20),
    };
  }

  if (title.toLowerCase().includes("office hour")) {
    return {
      type: "Office Hours",
      title,
    };
  }

  return {
    type: "Lecture",
    title,
  };
}

/**
 * Removes redudant AMs and PMs.
 *
 * 12:30 PM             ->  12:30 PM
 * 1:25 PM - 2:25 PM    ->  1:25 - 2:25 PM
 * 10:15 AM - 11:45 AM  ->  10:15 - 11:45 AM
 * 11:00 AM - 2:00 PM   ->  11:00 AM - 2:00 PM
 */
function removeRedundantPM(time) {
  const matches = time.match(/( [A,P]M)/g);
  if (matches.length === 2 && matches[0] === matches[1]) {
    const index = time.indexOf(matches[0]);
    return time.slice(0, index) + time.slice(index + 3);
  }

  return time;
}

// Extracts the href from an event
// myCourses makes this more complicated than it needs to be
function extractHref(element) {
  const anchors = $(element).find("a");

  if (anchors.length === 1) {
    // The href is hidden in a template, so we have to do some voodoo
    return $($(element).find("template").prop("content"))
      .find("a")
      .attr("href");
  }

  // Otherwise it's pretty simple
  return $(anchors[1]).attr("href");
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // We'll only handle "calendar" requests
  if (request.type !== "calendar") {
    return;
  }

  // The first network request sets the calendar page to the "Agenda" view
  // Otherwise it may be on another view and our scraping won't work
  $.post("https://mycourses.rit.edu/d2l/le/calendar/6605/periodfilter/save", {
    periodFilter: 5, // 5 is for "Agenda"
    d2l_referrer: request.token, // comes from myCourses local storage
  }).always(({ status }) => {
    // For some reason jQuery's .done() method never works for this request
    // So we just use .always() and double check for success here
    if (status !== 200) {
      sendResponse(null);
    }

    // Now we actually request the calendar page
    $.get("https://mycourses.rit.edu/d2l/le/calendar/6605")
      .done((response) => {
        const eventGroups = [];
        $(response)
          .find("div > div > .d2l-collapsepane")
          .each(function () {
            // For each event group...
            const dateText = $(this).find("h2").text()
            const newGroup = {
              date: dateText.substring(0, dateText.length - 6),
              events: [],
            };

            $(this)
              .find("li")
              .each(function () {
                // For each assignment...
                newGroup.events.push({
                  ...getEventTypeAndTitle($(this).find("h3").text()),
                  course: $(this).find(".d2l-le-calendar-dot-name").text(),
                  time: removeRedundantPM(
                    $($(this).find(".d2l-textblock")[0]).text()
                  ),
                  href: extractHref(this),
                });
              });

            eventGroups.push(newGroup);
          });

        sendResponse(eventGroups);
      })
      .fail(() => sendResponse(null));
  });

  // This keeps the message channel open until we call sendResponse
  return true;
});
