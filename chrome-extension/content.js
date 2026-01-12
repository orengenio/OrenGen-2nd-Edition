// OrenGen Lead Capture - Content Script
// Runs on every page to enable lead capture features

(function() {
  'use strict';

  // State
  let isInitialized = false;
  let captureWidget = null;

  // Initialize content script
  function init() {
    if (isInitialized) return;
    isInitialized = true;

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', handleKeyDown);

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(handleMessage);

    // Inject floating capture button (optional, based on settings)
    chrome.storage.sync.get(['showFloatingButton'], (result) => {
      if (result.showFloatingButton) {
        injectFloatingButton();
      }
    });

    console.log('OrenGen Lead Capture initialized');
  }

  // Handle keyboard shortcuts
  function handleKeyDown(e) {
    // Alt + Shift + L = Quick capture current page
    if (e.altKey && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      captureCurrentPage();
    }

    // Alt + Shift + O = Open popup
    if (e.altKey && e.shiftKey && e.key === 'O') {
      e.preventDefault();
      // Can't open popup programmatically, show notification instead
      showNotification('Use the extension icon to open OrenGen');
    }
  }

  // Handle messages from background script
  function handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'getPageInfo':
        sendResponse({
          url: window.location.href,
          domain: window.location.hostname.replace('www.', ''),
          title: document.title,
          description: getMetaDescription(),
          emails: findEmailsOnPage(),
          socialLinks: findSocialLinks(),
        });
        break;

      case 'highlightEmails':
        highlightEmails();
        sendResponse({ success: true });
        break;

      case 'showCaptureWidget':
        showCaptureWidget();
        sendResponse({ success: true });
        break;
    }
    return true;
  }

  // Get meta description
  function getMetaDescription() {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.getAttribute('content') : '';
  }

  // Find emails on page
  function findEmailsOnPage() {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const text = document.body.innerText;
    const matches = text.match(emailRegex) || [];

    // Deduplicate and filter
    const emails = [...new Set(matches)]
      .filter(email => !email.includes('example.com'))
      .slice(0, 10);

    return emails;
  }

  // Find social media links
  function findSocialLinks() {
    const socialPatterns = {
      linkedin: /linkedin\.com\/(company|in)\//,
      twitter: /(twitter|x)\.com\//,
      facebook: /facebook\.com\//,
      instagram: /instagram\.com\//,
    };

    const links = {};
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.href;
      for (const [platform, pattern] of Object.entries(socialPatterns)) {
        if (pattern.test(href) && !links[platform]) {
          links[platform] = href;
        }
      }
    });

    return links;
  }

  // Capture current page as lead
  function captureCurrentPage() {
    const domain = window.location.hostname.replace('www.', '');
    const title = document.title;

    chrome.runtime.sendMessage({
      action: 'captureDomain',
      domain: domain,
      source: 'keyboard_shortcut',
      notes: `Captured from: ${title}`,
    }, (response) => {
      if (response && response.success) {
        showNotification(`${domain} captured!`, 'success');
      } else {
        showNotification('Capture failed', 'error');
      }
    });
  }

  // Highlight emails on page
  function highlightEmails() {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    while (walker.nextNode()) {
      if (emailRegex.test(walker.currentNode.textContent)) {
        textNodes.push(walker.currentNode);
      }
    }

    textNodes.forEach(node => {
      const span = document.createElement('span');
      span.innerHTML = node.textContent.replace(
        emailRegex,
        '<mark class="orengen-email-highlight" style="background: #fef3c7; padding: 2px 4px; border-radius: 3px; cursor: pointer;">$&</mark>'
      );
      node.parentNode.replaceChild(span, node);
    });

    // Add click handler for highlighted emails
    document.querySelectorAll('.orengen-email-highlight').forEach(el => {
      el.addEventListener('click', () => {
        navigator.clipboard.writeText(el.textContent);
        showNotification(`Copied: ${el.textContent}`);
      });
    });
  }

  // Show capture widget
  function showCaptureWidget() {
    if (captureWidget) {
      captureWidget.remove();
      captureWidget = null;
      return;
    }

    const domain = window.location.hostname.replace('www.', '');
    const emails = findEmailsOnPage();
    const socialLinks = findSocialLinks();

    captureWidget = document.createElement('div');
    captureWidget.id = 'orengen-capture-widget';
    captureWidget.innerHTML = `
      <style>
        #orengen-capture-widget {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 320px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          overflow: hidden;
        }
        .orengen-widget-header {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .orengen-widget-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        .orengen-widget-close {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
        }
        .orengen-widget-close:hover {
          background: rgba(255,255,255,0.3);
        }
        .orengen-widget-body {
          padding: 16px;
        }
        .orengen-widget-section {
          margin-bottom: 16px;
        }
        .orengen-widget-section h4 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .orengen-widget-domain {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }
        .orengen-widget-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .orengen-widget-list li {
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
          margin-bottom: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .orengen-widget-list li button {
          background: #e2e8f0;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 11px;
        }
        .orengen-widget-list li button:hover {
          background: #cbd5e1;
        }
        .orengen-widget-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .orengen-widget-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .orengen-empty {
          color: #94a3b8;
          font-size: 13px;
          text-align: center;
          padding: 12px;
        }
      </style>
      <div class="orengen-widget-header">
        <h3>OrenGen Capture</h3>
        <button class="orengen-widget-close">&times;</button>
      </div>
      <div class="orengen-widget-body">
        <div class="orengen-widget-section">
          <h4>Domain</h4>
          <div class="orengen-widget-domain">${domain}</div>
        </div>
        <div class="orengen-widget-section">
          <h4>Emails Found (${emails.length})</h4>
          ${emails.length > 0 ? `
            <ul class="orengen-widget-list">
              ${emails.map(email => `
                <li>
                  <span>${email}</span>
                  <button data-email="${email}">Copy</button>
                </li>
              `).join('')}
            </ul>
          ` : '<div class="orengen-empty">No emails found on this page</div>'}
        </div>
        <div class="orengen-widget-section">
          <h4>Social Links</h4>
          ${Object.keys(socialLinks).length > 0 ? `
            <ul class="orengen-widget-list">
              ${Object.entries(socialLinks).map(([platform, url]) => `
                <li>
                  <span>${platform}</span>
                  <a href="${url}" target="_blank" style="color: #f97316; text-decoration: none; font-size: 11px;">Open</a>
                </li>
              `).join('')}
            </ul>
          ` : '<div class="orengen-empty">No social links found</div>'}
        </div>
        <button class="orengen-widget-btn" id="orengen-capture-btn">Capture This Lead</button>
      </div>
    `;

    document.body.appendChild(captureWidget);

    // Event listeners
    captureWidget.querySelector('.orengen-widget-close').addEventListener('click', () => {
      captureWidget.remove();
      captureWidget = null;
    });

    captureWidget.querySelector('#orengen-capture-btn').addEventListener('click', () => {
      captureCurrentPage();
      setTimeout(() => {
        if (captureWidget) {
          captureWidget.remove();
          captureWidget = null;
        }
      }, 1500);
    });

    captureWidget.querySelectorAll('[data-email]').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.email);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      });
    });
  }

  // Inject floating capture button
  function injectFloatingButton() {
    const button = document.createElement('button');
    button.id = 'orengen-floating-btn';
    button.innerHTML = `
      <style>
        #orengen-floating-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          border: none;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
          cursor: pointer;
          z-index: 999998;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        #orengen-floating-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
        }
        #orengen-floating-btn svg {
          width: 24px;
          height: 24px;
          color: white;
        }
      </style>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;

    button.addEventListener('click', showCaptureWidget);
    document.body.appendChild(button);
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 12px 24px;
      background: ${type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : '#1e293b'};
      color: white;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 999999;
      transition: transform 0.3s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      notification.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
