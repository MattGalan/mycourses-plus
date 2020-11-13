browser.runtime.sendMessage({ type: "covid" }, function (response) {
  $(
    "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4"
  ).prepend(`
    <div class="mcp-covid d2l-widget d2l-tile">
      <h2>
        <span>COVID-19</span>
        <span>${response.level}</span>
      </h2>
      <table>
        <tr>
          <th></th>
          <th>14 Days</th>
          <th>Total</th>
        </tr>
        <tr>
          <td>Students</td>
          <td>${response.recentStudent}</td>
          <td>${response.totalStudent}</td>
        </tr>
        <tr>
          <td>Staff</td>
          <td>${response.recentStaff}</td>
          <td>${response.totalStaff}</td>
        </tr>
      </table>
      <div class="mcp-covid-reminder">Remember to take your <a href="https://dailyhealth.rit.edu/?login=true" target="_blank">daily health screening</a>.</div>
    </div>
  `);
});
