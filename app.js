'use strict';

const SAMPLE = `# A little room for ideas

Every great thing starts with a few words. This is your space to **think out loud**, find a rhythm, and make something worth sharing.

> You don't have to see the whole staircase. Just take the first step.

## Make yourself at home

Markdown keeps the formatting out of your way, so you can focus on what matters: *the words*.

- **Write naturally.** Your preview follows along as you type.
- **Keep it simple.** A few little marks go a long way.
- **Make it yours.** This draft stays right here in your browser.
  - No account. No upload. Just a blank page.

### A small spark of code

\`\`\`javascript
const idea = "Something wonderful";

function begin(thought) {
  return thought + " starts here.";
}

console.log(begin(idea));
\`\`\`

## Your Markdown toolkit

| To make this | Write this |
| :--- | :--- |
| A heading | \`# Your title\` |
| Bold words | \`**like this**\` |
| A link | \`[text](https://example.com)\` |

### Before you go

- [x] Find a quiet corner
- [x] Put an idea on the page
- [ ] See where it takes you

Learn a little more with the [Markdown Guide](https://www.markdownguide.org/basic-syntax/).

---

*Go on. This is only the beginning.*
`;

const STORAGE_KEY = 'marginal.markdown-draft.v1';
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const status = document.getElementById('status');
const counts = document.getElementById('counts');
let storageAvailable = true;
let saveTimer;
let draft = SAMPLE;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) draft = saved;
} catch {
  storageAvailable = false;
}
editor.value = draft;
const rendererReady = typeof window.marked?.parse === 'function' && typeof window.DOMPurify?.sanitize === 'function';

function render() {
  const text = editor.value;
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  counts.textContent = `${words.toLocaleString()} ${words === 1 ? 'word' : 'words'} · ${text.length.toLocaleString()} characters`;
  if (!rendererReady) {
    preview.textContent = 'The preview libraries could not load. Connect to the internet and reload to try again. Your source is still editable and downloadable.';
    status.textContent = 'Preview unavailable';
    return;
  }
  if (!text.trim()) {
    preview.replaceChildren();
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = 'Your next idea starts on the left.';
    preview.append(empty);
    return;
  }
  try {
    const html = marked.parse(text, { gfm: true, breaks: false, async: false });
    // Only document-formatting elements: no scripts, styles, embeds, images,
    // forms, or remote resources. DOMPurify also checks link protocols.
    preview.innerHTML = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'del', 's', 'blockquote', 'ul', 'ol', 'li', 'pre', 'code', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'input'],
      ALLOWED_ATTR: ['href', 'title', 'start', 'align', 'type', 'checked', 'disabled'],
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false
    });
    preview.querySelectorAll('input').forEach(input => {
      input.type = 'checkbox';
      input.disabled = true;
    });
    preview.querySelectorAll('a').forEach(link => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  } catch {
    preview.textContent = 'This document could not be rendered. Your source is still available on the left.';
    status.textContent = 'Preview error';
  }
}

function saveDraft() {
  clearTimeout(saveTimer);
  try {
    localStorage.setItem(STORAGE_KEY, editor.value);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  if (rendererReady) status.textContent = storageAvailable ? 'Draft saved in this browser' : 'Storage unavailable · download to keep your draft';
}

editor.addEventListener('input', () => {
  render();
  if (rendererReady) status.textContent = 'Saving…';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveDraft, 350);
});
window.addEventListener('pagehide', saveDraft);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveDraft(); });

function replaceDraft(next, question) {
  if (editor.value === next) return;
  if (editor.value.trim() && !window.confirm(question)) return;
  editor.value = next;
  render();
  saveDraft();
  editor.focus();
  editor.setSelectionRange(0, 0);
  editor.scrollTop = 0;
}
document.getElementById('sample').addEventListener('click', () => replaceDraft(SAMPLE, 'Replace your current draft with the sample? Download your draft first if you want to keep it.'));
document.getElementById('clear').addEventListener('click', () => replaceDraft('', 'Clear your current draft? Download it first if you want to keep it.'));
document.getElementById('download').addEventListener('click', () => {
  const blob = new Blob([editor.value], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'untitled.md';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

render();
if (rendererReady) status.textContent = storageAvailable ? 'Draft stays in this browser' : 'Storage unavailable · download to keep your draft';
