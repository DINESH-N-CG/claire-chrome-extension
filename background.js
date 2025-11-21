// Extension installation/update handler
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('Claire Extension installed!');

    await chrome.storage.local.set({
      enabled: true,
      firstRun: true,
      lastActivityTime: Date.now()
    });

    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    console.log('Side panel behavior set');

    // Inject content script into all existing tabs
    await injectContentScriptIntoExistingTabs();

    // Start inactivity monitoring
    startInactivityMonitoring();

  } else if (details.reason === 'update') {
    console.log('Claire Extension updated to version:', chrome.runtime.getManifest().version);
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    
    // Inject content script into all existing tabs after update
    await injectContentScriptIntoExistingTabs();

    // Start inactivity monitoring
    startInactivityMonitoring();
  }
});

// Extension startup handler
chrome.runtime.onStartup.addListener(async () => {
  console.log('Claire Extension started');
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  startInactivityMonitoring();
});

// Inject content script into all existing tabs
async function injectContentScriptIntoExistingTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    
    for (const tab of tabs) {
      // Skip chrome:// and other restricted URLs
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
        continue;
      }

      try {
        // Check if content script is already injected
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            return !!document.getElementById('claire-selection-tooltip') || window.claireContentScriptLoaded;
          }
        });

        // If not injected, inject it
        if (!results[0]?.result) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });

          await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['content.css']
          });

          console.log('Content script injected into tab:', tab.id, tab.url);
        }
      } catch (error) {
        console.log('Could not inject into tab:', tab.id, error.message);
      }
    }
  } catch (error) {
    console.error('Error injecting content scripts:', error);
  }
}

// Message handler - handles communication from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request.type, 'from:', sender.tab?.id);

  if (request.type === 'USER_ACTIVITY') {
    chrome.storage.local.set({ lastActivityTime: Date.now() });
    chrome.action.setBadgeText({ text: '' });
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'OPEN_CLAIRE') {
    const windowId = sender.tab?.windowId;

    if (windowId) {
      console.log(request.text.substring(0, 50) + '...');

      chrome.storage.local.set({
        selectedText: request.text,
        selectedTextUrl: request.url || '',
        selectedTextPageTitle: request.pageTitle || '',
        context: request.context || 'text_selection',
        timestamp: Date.now()
      }, async () => {

        // Always send selected text to sidepanel (even if already open)
        chrome.runtime.sendMessage({
          type: "UPDATE_SELECTED_TEXT",
          text: request.text,
          url: request.url,
          pageTitle: request.pageTitle
        });

        console.log('Text stored, opening side panel...');

        try {
          await chrome.sidePanel.open({ windowId });
          sendResponse({ success: true });
        } catch (error) {
          console.error('Error opening side panel:', error);
          sendResponse({ success: false, error: error.message });
        }
      });

      return true; // Keep channel open
    }

    sendResponse({ success: false, error: 'No window ID found' });
    return true;
  }

  if (request.type === 'CLOSE_SIDE_PANEL') {
    sendResponse({ success: true, message: 'Use X button to close' });
    return true;
  }

  if (request.type === 'PING') {
    sendResponse({ status: 'ok', version: chrome.runtime.getManifest().version });
    return true;
  }

  return true;
});

// Toolbar icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    await chrome.action.setBadgeText({ text: '' });
    await chrome.storage.local.set({ lastActivityTime: Date.now() });
  } catch (error) {
    console.error('Error opening side panel from toolbar:', error);
  }
});

// Keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-claire') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      try {
        await chrome.sidePanel.open({ windowId: tabs[0].windowId });
      } catch (error) {
        console.error('Error opening side panel from shortcut:', error);
      }
    }
  }
});

// When sidepanel closes → reset conversation
chrome.sidePanel.onClosed.addListener(async () => {
  console.log("Side panel closed → resetting conversation...");
  await chrome.storage.local.remove([
    'chatHistory',
    'selectedText',
    'timestamp'
  ]);
  await chrome.storage.local.set({ forceNewConversation: true });
});

// Inactivity monitoring
const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds for testing

function startInactivityMonitoring() {
  setInterval(async () => {
    const { lastActivityTime } = await chrome.storage.local.get(['lastActivityTime']);
    
    if (!lastActivityTime) {
      await chrome.storage.local.set({ lastActivityTime: Date.now() });
      return;
    }

    const timeSinceActivity = Date.now() - lastActivityTime;

    if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
      // Show badge
      await chrome.action.setBadgeText({ text: '👋' });
      await chrome.action.setBadgeBackgroundColor({ color: '#667eea' });

      // Show browser notification
      chrome.notifications.create('claire-inactive-' + Date.now(), {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),
        title: 'Claire AI',
        message: 'Still there? I\'m ready to assist you! 👋',
        priority: 1,
        requireInteraction: false
      });

      // Reset timer to avoid spam
      await chrome.storage.local.set({ lastActivityTime: Date.now() });
    }
  }, 30000); // Check every 30 seconds
}

// Handle notification clicks
chrome.notifications.onClicked.addListener(async (notificationId) => {
  if (notificationId.startsWith('claire-inactive-')) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await chrome.sidePanel.open({ windowId: tabs[0].windowId });
      chrome.notifications.clear(notificationId);
      await chrome.action.setBadgeText({ text: '' });
      await chrome.storage.local.set({ lastActivityTime: Date.now() });
    }
  }
});



