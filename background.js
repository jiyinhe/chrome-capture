var getTabContent = function(context, timestamp, tabId, retries) {
  if(undefined == retries) retries = 3;
  chrome.tabs.sendMessage(tabId, {text : "get_tab_content"}, function(data) {
    if(undefined == data && retries > 0) {
      getTabContent(timestamp, context, tabId, retries - 1);
    } else {
      console.log(timestamp, context, tabId, data);
    }
  });
}

chrome.tabs.onActivated.addListener(function(info) {
  getTabContent("tab_switch", Date.now(), info.tabId);
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    getTabContent("page_load", Date.now(), tabId);
  }
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if(windowId == -1) {
    console.log(Date.now(), "browser_lost_focus") 
  } else {
    chrome.windows.get(windowId, {populate: true}, function(wndw) {
      wndw.tabs.forEach(function(tab) {
        if(tab.active) {
          getTabContent("window_switch", Date.now(), tab.id);
        }
      });
    });
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if(msg.text == "set_url_task") {
    console.log("task_url_assignment", Date.now(), {
      task: msg.task,
      url: msg.url,
      wholeDomain: msg.domain
    }) 
  }
});
