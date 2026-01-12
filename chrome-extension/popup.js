// OrenGen Lead Capture - Popup Script

// Configuration
const CONFIG = {
  API_URL: '', // Set in options
  API_KEY: '', // Set in options
};

// State
let isConnected = false;
let recentCaptures = [];

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  await checkConnection();
  await loadRecentCaptures();
  setupEventListeners();
  await autofillCurrentPage();
});

// Load configuration from storage
async function loadConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiUrl', 'apiKey'], (result) => {
      CONFIG.API_URL = result.apiUrl || '';
      CONFIG.API_KEY = result.apiKey || '';
      resolve();
    });
  });
}

// Check API connection
async function checkConnection() {
  const statusBar = document.getElementById('connection-status');
  const statusText = document.getElementById('status-text');

  if (!CONFIG.API_URL || !CONFIG.API_KEY) {
    statusBar.className = 'status-bar disconnected';
    statusText.textContent = 'Not configured - Click settings';
    isConnected = false;
    return;
  }

  try {
    const response = await fetch(`${CONFIG.API_URL}/api/health`, {
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
      },
    });

    if (response.ok) {
      statusBar.className = 'status-bar connected';
      statusText.textContent = 'Connected to OrenGen';
      isConnected = true;
    } else {
      throw new Error('API error');
    }
  } catch (error) {
    statusBar.className = 'status-bar disconnected';
    statusText.textContent = 'Connection failed';
    isConnected = false;
  }
}

// Load recent captures from storage
async function loadRecentCaptures() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['recentCaptures'], (result) => {
      recentCaptures = result.recentCaptures || [];
      renderRecentCaptures();
      resolve();
    });
  });
}

// Save recent captures to storage
async function saveRecentCaptures() {
  return new Promise((resolve) => {
    chrome.storage.local.set({ recentCaptures: recentCaptures.slice(0, 10) }, resolve);
  });
}

// Render recent captures list
function renderRecentCaptures() {
  const listEl = document.getElementById('recent-list');

  if (recentCaptures.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No recent captures</div>';
    return;
  }

  listEl.innerHTML = recentCaptures.map((capture) => `
    <div class="recent-item">
      <div class="recent-icon">${capture.domain.substring(0, 2)}</div>
      <div class="recent-info">
        <div class="recent-domain">${capture.domain}</div>
        <div class="recent-time">${formatTimeAgo(capture.timestamp)}</div>
      </div>
      <div class="recent-status ${capture.status}"></div>
    </div>
  `).join('');
}

// Format time ago
function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Autofill with current page info
async function autofillCurrentPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const url = new URL(tab.url);
      const domain = url.hostname.replace('www.', '');

      // Only autofill for http/https pages
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        document.getElementById('domain').value = domain;
      }
    }
  } catch (error) {
    console.error('Error getting current tab:', error);
  }
}

// Setup event listeners
function setupEventListeners() {
  // Capture form submission
  document.getElementById('capture-form').addEventListener('submit', handleCapture);

  // Capture current page button
  document.getElementById('capture-page-btn').addEventListener('click', handleCapturePage);

  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Open dashboard link
  document.getElementById('open-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
    if (CONFIG.API_URL) {
      chrome.tabs.create({ url: `${CONFIG.API_URL}/dashboard/leads` });
    } else {
      showToast('Configure API URL in settings first', 'error');
    }
  });
}

// Handle form capture
async function handleCapture(e) {
  e.preventDefault();

  const btn = document.getElementById('capture-btn');
  const originalText = btn.innerHTML;

  if (!isConnected) {
    showToast('Not connected to OrenGen', 'error');
    return;
  }

  const domain = document.getElementById('domain').value.trim();
  const source = document.getElementById('source').value;
  const notes = document.getElementById('notes').value.trim();

  if (!domain) {
    showToast('Please enter a domain', 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Capturing...';

  try {
    const response = await fetch(`${CONFIG.API_URL}/api/leads/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain,
        source,
        notes,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to capture lead');
    }

    const data = await response.json();

    // Add to recent captures
    recentCaptures.unshift({
      domain,
      source,
      timestamp: Date.now(),
      status: 'success',
      id: data.id,
    });
    await saveRecentCaptures();
    renderRecentCaptures();

    // Clear form
    document.getElementById('notes').value = '';

    showToast('Lead captured successfully!', 'success');

    // Notify background script
    chrome.runtime.sendMessage({
      action: 'leadCaptured',
      data: { domain, source },
    });

  } catch (error) {
    console.error('Capture error:', error);

    // Add to recent as failed
    recentCaptures.unshift({
      domain,
      source,
      timestamp: Date.now(),
      status: 'error',
    });
    await saveRecentCaptures();
    renderRecentCaptures();

    showToast('Failed to capture lead', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Handle capture current page with enrichment
async function handleCapturePage() {
  const btn = document.getElementById('capture-page-btn');
  const originalText = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = 'Capturing...';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      throw new Error('No active tab');
    }

    const url = new URL(tab.url);
    const domain = url.hostname.replace('www.', '');

    // Fill form and submit
    document.getElementById('domain').value = domain;
    document.getElementById('source').value = 'browsing';
    document.getElementById('notes').value = `Captured from: ${tab.title}`;

    // Trigger form submission
    document.getElementById('capture-form').dispatchEvent(new Event('submit'));

  } catch (error) {
    console.error('Capture page error:', error);
    showToast('Could not capture this page', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'success'
        ? '<path d="M20 6L9 17l-5-5"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'}
    </svg>
    ${message}
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = `
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);
