const list = document.getElementById('list');
const promptCount = document.getElementById('prompt-count');
const platform = document.getElementById('platform');
const logo = document.getElementById('main-logo');
const supportedView = document.getElementById('supported-view');
const unsupportedView = document.getElementById('unsupported-view');

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab?.url) return;
  const url = tab.url.toLowerCase();
  let aiType = null;

  if (url.includes('chatgpt.com') || url.includes('openai.com')) aiType = 'ChatGPT';
  else if (url.includes('deepseek.com')) aiType = 'DeepSeek';
  else if (url.includes('claude.ai')) aiType = 'Claude';
  else if (url.includes('gemini.google.com')) aiType = 'Gemini';

  if (aiType) {
    supportedView.style.display = 'block';
    unsupportedView.style.display = 'none';
    platform.innerText = aiType;
    logo.src = aiType.toLowerCase() + '.png';
    loadList();
  } else {
    supportedView.style.display = 'none';
    unsupportedView.style.display = 'block';
  }
});

function loadList() {
  chrome.storage.local.get(['prompts'], (data) => {
    const prompts = data.prompts || [];
    promptCount.innerText = prompts.length;
    list.innerHTML = '';
    
    if (prompts.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#999; font-size:12px; margin-top:20px;">No prompts captured yet. Try sending a message!</p>';
        return;
    }

    prompts.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'prompt';
      div.innerText = p.text.slice(0, 85) + (p.text.length > 85 ? '...' : '');
      div.onclick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          chrome.tabs.sendMessage(tab.id, { type: 'SCROLL_TO_PROMPT', index: i });
        });
      };
      list.appendChild(div);
    });
  });
}