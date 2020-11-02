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

function deadlineHeaderClicked() {
  sortByDate();
}

function sortByDate() {
  assignments.sort((a, b) => a.dateObj - b.dateObj);
  renderTable();
}

function renderTable() {
  // Remove existing MCP table
  $(".mcp-assignments").remove();

  // Create new table
  $("#d_content_r_c2").append(`
    <table class="mcp-assignments">
      <tr>
        <th onclick="helloWorld()">Name</th>
        <th>Submissions</th>
        <th id="mcp-deadline-header">Deadline</th>
      </tr>
    </table>
  `);

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
