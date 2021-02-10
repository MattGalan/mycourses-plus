// Replace starfish panel with a more useful version with more links to RIT services
$(
  "body > div.d2l-page-main.d2l-max-width.d2l-min-width.d2l-home > div.d2l-page-main-padding > div.d2l-homepage > div > div.homepage-row > div > div.homepage-col-4 > div.d2l-widget.d2l-tile.d2l-custom-widget"
).html(`
  <h2>RIT Links</h2>
  <a href="https://rit.starfishsolutions.com/starfish-ops/instructor/serviceCatalog.html#/" target="_blank">Starfish</a>
  <a href="https://tigercenter.rit.edu/" target="_blank">Tiger Center</a>
  <a href="https://campus.ps.rit.edu/psp/PRIT4J/?cmd=login" target="_blank">Student Info System (SIS)</a>
  <a href="https://eservices.rit.edu/eservices/" target="_blank">eServices</a>
`);
