// OrenGen Lead Capture - Background Service Worker

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default config
    chrome.storage.sync.set({
      apiUrl: '',
      apiKey: '',
      autoCapture: false,
      captureOnVisit: false,
      notificationsEnabled: true,
    });

    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }

  // Create context menu items
  setupContextMenus();
});

// Setup context menus
function setupContextMenus() {
  // Remove existing menus
  chrome.contextMenus.removeAll();

  // Add "Capture as Lead" context menu
  chrome.contextMenus.create({
    id: 'capture-lead',
    title: 'Capture as Lead',
    contexts: ['page', 'link'],
  });

  // Add "Capture Selected Domain" for text selection
  chrome.contextMenus.create({
    id: 'capture-selected',
    title: 'Capture "%s" as Lead',
    contexts: ['selection'],
  });

  // Add "Quick Add to OrenGen"
  chrome.contextMenus.create({
    id: 'quick-add',
    title: 'Quick Add to OrenGen',
    contexts: ['page'],
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const config = await getConfig();

  if (!config.apiUrl || !config.apiKey) {
    chrome.runtime.openOptionsPage();
    return;
  }

  let domain = '';

  switch (info.menuItemId) {
    case 'capture-lead':
      // Get domain from page or link URL
      const url = info.linkUrl || info.pageUrl;
      if (url) {
        try {
          domain = new URL(url).hostname.replace('www.', '');
        } catch (e) {
          console.error('Invalid URL:', url);
          return;
        }
      }
      break;

    case 'capture-selected':
      // Use selected text as domain
      domain = info.selectionText.trim().toLowerCase();
      // Clean up if it's a full URL
      if (domain.includes('://')) {
        try {
          domain = new URL(domain).hostname.replace('www.', '');
        } catch (e) {
          // Use as-is if not a valid URL
        }
      }
      break;

    case 'quick-add':
      // Get domain from current page
      if (tab && tab.url) {
        try {
          domain = new URL(tab.url).hostname.replace('www.', '');
        } catch (e) {
          console.error('Invalid tab URL:', tab.url);
          return;
        }
      }
      break;
  }

  if (domain) {
    await captureLead(domain, 'context_menu', `Captured from: ${tab?.title || 'Unknown page'}`, config);
  }
});

// Capture lead via API
async function captureLead(domain, source, notes, config) {
  try {
    const response = await fetch(`${config.apiUrl}/api/leads/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain,
        source,
        notes,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    // Show notification if enabled
    if (config.notificationsEnabled) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Lead Captured',
        message: `${domain} has been added to OrenGen`,
      });
    }

    // Store in recent captures
    const stored = await chrome.storage.local.get(['recentCaptures']);
    const recentCaptures = stored.recentCaptures || [];
    recentCaptures.unshift({
      domain,
      source,
      timestamp: Date.now(),
      status: 'success',
      id: data.id,
    });

    await chrome.storage.local.set({
      recentCaptures: recentCaptures.slice(0, 50),
    });

    return { success: true, data };

  } catch (error) {
    console.error('Capture error:', error);

    if (config.notificationsEnabled) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Capture Failed',
        message: `Could not capture ${domain}`,
      });
    }

    return { success: false, error: error.message };
  }
}

// Get config from storage
async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiUrl', 'apiKey', 'autoCapture', 'captureOnVisit', 'notificationsEnabled'], resolve);
  });
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'leadCaptured':
      // Update badge or perform other actions
      updateBadge();
      break;

    case 'captureDomain':
      // Capture domain from content script
      getConfig().then(config => {
        captureLead(message.domain, message.source || 'auto', message.notes || '', config)
          .then(sendResponse);
      });
      return true; // Keep channel open for async response

    case 'getStats':
      // Return capture statistics
      chrome.storage.local.get(['recentCaptures'], (result) => {
        const captures = result.recentCaptures || [];
        sendResponse({
          total: captures.length,
          today: captures.filter(c => Date.now() - c.timestamp < 86400000).length,
          success: captures.filter(c => c.status === 'success').length,
        });
      });
      return true;

    case 'checkConnection':
      // Check API connection
      getConfig().then(async (config) => {
        if (!config.apiUrl || !config.apiKey) {
          sendResponse({ connected: false, reason: 'not_configured' });
          return;
        }

        try {
          const response = await fetch(`${config.apiUrl}/api/health`, {
            headers: { 'Authorization': `Bearer ${config.apiKey}` },
          });
          sendResponse({ connected: response.ok });
        } catch (e) {
          sendResponse({ connected: false, reason: 'network_error' });
        }
      });
      return true;
  }
});

// Update extension badge
async function updateBadge() {
  const stored = await chrome.storage.local.get(['recentCaptures']);
  const today = (stored.recentCaptures || [])
    .filter(c => Date.now() - c.timestamp < 86400000 && c.status === 'success')
    .length;

  if (today > 0) {
    chrome.action.setBadgeText({ text: String(today) });
    chrome.action.setBadgeBackgroundColor({ color: '#f97316' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Initialize badge on startup
updateBadge();

// Optional: Auto-capture when visiting certain pages
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !tab.url) return;

  const config = await getConfig();
  if (!config.captureOnVisit || !config.apiUrl || !config.apiKey) return;

  try {
    const url = new URL(tab.url);

    // Only capture for http/https
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Skip common non-business sites
    const skipDomains = ['google.com', 'facebook.com', 'twitter.com', 'youtube.com', 'reddit.com', 'amazon.com'];
    const domain = url.hostname.replace('www.', '');

    if (skipDomains.some(skip => domain.includes(skip))) return;

    // Check if already captured recently
    const stored = await chrome.storage.local.get(['recentCaptures']);
    const recentCaptures = stored.recentCaptures || [];
    const recentlyCaptured = recentCaptures.some(
      c => c.domain === domain && Date.now() - c.timestamp < 3600000 // 1 hour
    );

    if (!recentlyCaptured) {
      await captureLead(domain, 'auto_visit', `Auto-captured from: ${tab.title}`, config);
    }
  } catch (e) {
    // Ignore invalid URLs
  }
});
