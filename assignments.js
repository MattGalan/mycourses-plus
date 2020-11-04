const assignments = [];

function scrapeHref(el) {
  return $(el).find("a").attr("href");
}

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

  if(this.textContent.includes("%")) {
    scoreObject.cleanedScore = this.textContent;
  } else {
    scoreObject.cleanedScore = this.textContent.substring(0, this.textContent.length - 3);
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

let sortType = null;
let reverseSort = false;

function nameHeaderClicked() {
  headerClicked("name", (a, b) => a.name.localeCompare(b.name));
}

function submissionsHeaderClicked() {
  headerClicked("submissions", (a, b) =>
    a.submission.localeCompare(b.submission)
  );
}

// using localeCompare on text here results in the unscored entries in the wrong place
function scoreHeaderClicked() {
  headerClicked("score", (a, b) => {
    const aNumerator = a.score.numerator === "-" ? 0 : a.score.numerator;
    const bNumerator = b.score.numerator === "-" ? 0 : b.score.numerator;
    return bNumerator / b.score.denominator - aNumerator / a.score.denominator;
  });
}

function deadlineHeaderClicked() {
  headerClicked("deadline", (a, b) => a.dateObj - b.dateObj);
}

function headerClicked(type, sortFn) {
  if (sortType === type) {
    reverseSort = !reverseSort;
  } else {
    sortType = type;
    reverseSort = false;
  }

  assignments.sort(sortFn);
  reverseSort && assignments.reverse();

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
        </th>
      </tr>
    </table>
  `);

  // Add click handlers to table headers
  $("#mcp-name-header").click(nameHeaderClicked);
  $("#mcp-submissions-header").click(submissionsHeaderClicked);
  $("#mcp-score-header").click(scoreHeaderClicked);
  $("#mcp-deadline-header").click(deadlineHeaderClicked);

  // Populate table
  assignments.forEach((a) =>
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

renderTable();

console.log(assignments);
