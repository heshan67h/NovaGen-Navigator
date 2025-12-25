chrome.runtime.onInstalled.addListener(() => {
  console.log("NovaGen Navigator Installed!");
  chrome.storage.local.set({ activePrompts: [] });
});

chrome.tabs.onActivated.addListener(() => {
  
});