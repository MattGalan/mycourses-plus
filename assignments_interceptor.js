/*
Intercepts the primary network request for the assignments page,
and redirects it to ensure we're always requesting 200 assignments
per page.
*/
//Does not work in firefox *WHY*
browser.webRequest.onBeforeRequest.addListener(
  function (info) {
    const decodedUrl = decodeURIComponent(info.url);

    const fixedUrl = decodedUrl.includes("PageSize")
      ? decodedUrl.replace(/"PageSize":"\d*"/, '"PageSize":"200"')
      : decodedUrl +
      "&d2l_stateScopes=%7B%221%22%3A%5B%22gridpagenum%22,%22search%22,%22pagenum%22%5D,%222%22%3A%5B%22lcs%22%5D,%223%22%3A%5B%22grid%22,%22pagesize%22,%22htmleditor%22,%22hpg%22%5D%7D&d2l_stateGroups=%5B%22grid%22,%22gridpagenum%22%5D&d2l_statePageId=399&d2l_state_grid=%7B%22Name%22%3A%22grid%22,%22Controls%22%3A%5B%7B%22ControlId%22%3A%7B%22ID%22%3A%22grid_main%22%7D,%22StateType%22%3A%22%22,%22Key%22%3A%22%22,%22Name%22%3A%22gridFolders%22,%22State%22%3A%7B%22PageSize%22%3A%22200%22,%22SortField%22%3A%22DropboxId%22,%22SortDir%22%3A0%7D%7D%5D%7D&d2l_state_gridpagenum=%7B%22Name%22%3A%22gridpagenum%22,%22Controls%22%3A%5B%7B%22ControlId%22%3A%7B%22ID%22%3A%22grid_main%22%7D,%22StateType%22%3A%22pagenum%22,%22Key%22%3A%22%22,%22Name%22%3A%22gridFolders%22,%22State%22%3A%7B%22PageNum%22%3A1%7D%7D%5D%7D&d2l_change=1";

    return { redirectUrl: fixedUrl };
  },
  // filters
  {
    urls: ["https://mycourses.rit.edu/d2l/lms/dropbox/user/folders_list.d2l"],
    types: ["main_frame"],
  },
  // extraInfoSpec
  ["blocking"]
);
