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
$(".dco.d2l-grades-score").each(function (index) {
  const rawScore = this.textContent;
  // For some reason there's a " - " at the end of every score, so we'll remove that
  const cleanedScore = rawScore.substring(0, rawScore.length - 3);
  assignments[index].score = cleanedScore;
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

function renderTable() {
  // Remove existing MCP table
  $(".mcp-assignments").remove();

  // Create new table
  $("#d_content_r_c2").append(`
    <table class="mcp-assignments">
      <tr>
        <th id="mcp-name-header">Name</th>
        <th id="mcp-submissions-header">Submissions</th>
        <th id="mcp-deadline-header">Deadline<span class="mcp-sort-arrow"/>
        </th>
      </tr>
    </table>
  `);

  // Add click handlers to table headers
  $("#mcp-name-header").click(nameHeaderClicked);
  $("#mcp-submissions-header").click(submissionsHeaderClicked);
  $("#mcp-deadline-header").click(deadlineHeaderClicked);

  // Populate table
  assignments.forEach((a) =>
    $(".mcp-assignments").append(`
    <tr>
      <td><a href=${a.descriptionHref}>${a.name}</a></td>
      <td><a href=${a.submissionHistoryHref}>${a.submission}</a></td>
      <td>${a.deadline}</td>
    </tr>
  `)
  );
}

renderTable();

console.log(assignments);
