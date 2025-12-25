const AI_SELECTORS = {
  'chatgpt.com': '[data-message-author-role="user"]',
  'openai.com': '[data-message-author-role="user"]',
  'deepseek.com': 'div[class*="user-message-"]',
  'claude.ai': '[data-testid="user-message"]',
  'gemini.google.com': 'div.query-text'
};

function getSelector() {
  const host = window.location.hostname.replace('www.', '');
  return AI_SELECTORS[host] || Object.values(AI_SELECTORS).find(s => window.location.href.includes(host));
}

function capturePrompts() {
  const selector = getSelector();
  if (!selector) return;

  // querySelectorAll helps support complex selectors like [data-...]
  const elements = Array.from(document.querySelectorAll(selector));
  const promptData = elements.map((el, index) => ({
    id: index,
    text: el.innerText.trim()
  }));

  chrome.storage.local.set({ prompts: promptData });
}

// Auto-detect new messages
const observer = new MutationObserver(() => capturePrompts());
observer.observe(document.body, { childList: true, subtree: true });

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SCROLL_TO_PROMPT') {
    const selector = getSelector();
    const targets = document.querySelectorAll(selector);
    const target = targets[msg.index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('nova-box-highlight');
      setTimeout(() => target.classList.remove('nova-box-highlight'), 3000);
    }
  }
});