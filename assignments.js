const assignments = [];

function scrapeHref(el) {
  return $(el).find("a").attr("href");
}

const sortFns = {
  name: (a, b) => a.name.localeCompare(b.name),
  submissions: (a, b) => a.submission.localeCompare(b.submission),
  score: (a, b) => {
    // using localeCompare on text here results in the unscored entries in the wrong place
    const aNumerator = a.score.numerator === "-" ? 0 : a.score.numerator;
    const bNumerator = b.score.numerator === "-" ? 0 : b.score.numerator;
    return bNumerator / b.score.denominator - aNumerator / a.score.denominator;
  },
  deadline: (a, b) => a.dateObj - b.dateObj,
};

// Scrape assignment names
$(".d_ich").each(function () {
  assignments.push({
    name: this.textContent,
    descriptionHref: scrapeHref(this),
    group: $(this).find(".di_i").length === 1,
    turnItIn: $(this).find(".d2l-image").length === 1,
  });
});

// Scrape scores
$(".dco.d2l-grades-score > div.dco_c").each(function (index) {
  const labels = $(this).children("label");
  let scoreObject = {};

  if (this.textContent.includes("%")) {
    scoreObject.cleanedScore = this.textContent;
  } else {
    scoreObject.cleanedScore = this.textContent.substring(
      0,
      this.textContent.length - 3
    );
  }

  scoreObject.numerator = labels[0].textContent;
  scoreObject.denominator = labels[2].textContent;
  assignments[index].score = scoreObject;
});

// Scrape feedback links
$("#z_b > tbody > tr > td:nth-child(4)").each(function (index) {
  assignments[index].feedbackHref = scrapeHref(this);
});

// Scrape submission statuses and deadlines
const submissionsAndDeadlines = [];
$(".d_gn.d_gc.d_gt").each(function () {
  submissionsAndDeadlines.push(this);
});

// Populate assignment objects with statuses and deadlines
assignments.forEach((assignment, index) => {
  const submission = submissionsAndDeadlines[index * 2];
  const deadline = submissionsAndDeadlines[index * 2 + 1];

  assignment.submission = submission.textContent;
  assignment.submissionHistoryHref = scrapeHref(submission);
  assignment.deadline = deadline.textContent;
  assignment.dateObj = new Date(deadline.textContent);
});

// Remove the yucky myCourses table
$("#d_content_r_p").remove();

// Initial sort values will be set in initialization down below
let sortType = null;
let reverseSort = false;

function headerClicked(type) {
  if (sortType === type) {
    reverseSort = !reverseSort;
  } else {
    sortType = type;
    reverseSort = false;
  }

  assignments.sort(sortFns[type]);
  reverseSort && assignments.reverse();

  browser.storage.sync.set({
    assignmentSortType: sortType,
    assignmentReverseSort: reverseSort,
  });

  renderTable();
}

function renderTableHeader(name) {
  lowerCaseName = name.toLowerCase();

  const arrow =
    sortType === lowerCaseName
      ? `<div class="mcp-sort-arrow${reverseSort ? " reverse" : ""}"></div>`
      : "";

  return `<th id="mcp-${lowerCaseName}-header">${name}${arrow}</th>`;
}

// Returns a table cell with a link if href exists, and a span if not
function renderLink(text, href) {
  const contents = href ? `<a href=${href}>${text}</>` : `<span>${text}</span>`;
  return `<td>${contents}</td>`;
}

function renderTable() {
  // Remove existing MCP table
  $(".mcp-assignments").remove();

  // Create new table
  $("#d_content_r_c2").append(`
    <table class="mcp-assignments">
      <tr>
        ${renderTableHeader("Name")}
        ${renderTableHeader("Submissions")}
        ${renderTableHeader("Score")}
        ${renderTableHeader("Deadline")}
      </tr>
    </table>
  `);

  // Add click handlers to table headers
  $("#mcp-name-header").click(() => headerClicked("name"));
  $("#mcp-submissions-header").click(() => headerClicked("submissions"));
  $("#mcp-score-header").click(() => headerClicked("score"));
  $("#mcp-deadline-header").click(() => headerClicked("deadline"));

  // Hide submitted assignments, if appropriate
  const filteredAssignments = $("#hide-submitted").is(":checked")
    ? assignments.filter((a) => !a.submission.includes("Submission"))
    : assignments;

  // Populate table
  filteredAssignments.forEach((a) =>
    $(".mcp-assignments").append(`
      <tr>
        ${renderLink(a.name, a.descriptionHref)}
        ${renderLink(a.submission, a.submissionHistoryHref)}
        ${renderLink(a.score.cleanedScore, a.feedbackHref)}
        <td>${a.deadline}</td>
      </tr>
    `)
  );
}

browser.storage.sync.get(
  ["hideSubmitted", "assignmentSortType", "assignmentReverseSort"],
  ({ hideSubmitted, assignmentSortType, assignmentReverseSort }) => {
    // Inject "Hide submitted" toggle
    $("#d_content_r > div > ul > li").prepend(`
      <input class="toggle" type="checkbox" id="hide-submitted"/>
      <label for="hide-submitted">Hide submitted</label>
    `);

    // When it's clicked, toggle the value in storage and re-render table
    $("#hide-submitted")
      .prop("checked", hideSubmitted)
      .click(() => {
        browser.storage.sync.set({
          hideSubmitted: $("#hide-submitted").is(":checked"),
        });
        renderTable();
      });

    // Remember previous sort configuration
    sortType = assignmentSortType;
    reverseSort = assignmentReverseSort;
    assignments.sort(sortFns[sortType]);
    reverseSort && assignments.reverse();

    // Initial table render
    renderTable();
  }
);
