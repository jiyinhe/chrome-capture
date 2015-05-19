chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if(msg.text == "get_tab_content") {
    sendResponse({
      uri: document.URL,
      title: document.title,
      content: document.all[0].outerHTML
    });
  }
});
