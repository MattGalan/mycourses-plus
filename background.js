browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "covid") {
    $.ajax({
      url: "https://www.rit.edu/ready/dashboard",
      dataType: "text",
      success: (data) => {
        const level = $(data)
          .find("#pandemic-message-container > div > div > a")
          .text();

        const recentStudent = $(data)
          .find(
            "#block-rit-bootstrap-subtheme-content > div.field.field--name-field-content.field--type-entity-reference-revisions.field--label-hidden.field__items > div:nth-child(2) > div > div > div > div.row > div > div:nth-child(2) > div > div > div > div > div.col-12.col-md-6.col-statistic.col-statistic-2.item-1.odd > div > p"
          )
          .text()
          .trim();

        const recentStaff = $(data)
          .find(
            "#block-rit-bootstrap-subtheme-content > div.field.field--name-field-content.field--type-entity-reference-revisions.field--label-hidden.field__items > div:nth-child(2) > div > div > div > div.row > div > div:nth-child(2) > div > div > div > div > div.col-12.col-md-6.col-statistic.col-statistic-2.item-2.even.row-end-sm.row-end-lg > div > p"
          )
          .text()
          .trim();

        const totalStudent = $(data)
          .find(
            "#block-rit-bootstrap-subtheme-content > div.field.field--name-field-content.field--type-entity-reference-revisions.field--label-hidden.field__items > div:nth-child(2) > div > div > div > div.row > div > div:nth-child(4) > div > div > div > div > div.col-12.col-md-6.col-statistic.col-statistic-2.item-1.odd > div > p"
          )
          .text()
          .trim();

        const totalStaff = $(data)
          .find(
            "#block-rit-bootstrap-subtheme-content > div.field.field--name-field-content.field--type-entity-reference-revisions.field--label-hidden.field__items > div:nth-child(2) > div > div > div > div.row > div > div:nth-child(4) > div > div > div > div > div.col-12.col-md-6.col-statistic.col-statistic-2.item-2.even.row-end-sm.row-end-lg > div > p"
          )
          .text()
          .trim();

        sendResponse({
          level,
          recentStudent,
          recentStaff,
          totalStudent,
          totalStaff,
        });
      },
    });

    // This keeps the message channel open until we call sendResponse
    return true;
  }
});
