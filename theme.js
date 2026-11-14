// Apply before styles load, independently of the Markdown CDN libraries.
(() => {
  'use strict';
  const key = 'marginal.theme.v1';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch { /* Theme switching still works without storage. */ }

  function apply(theme) {
    root.dataset.theme = theme;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', String(theme === 'dark'));
      toggle.querySelector('.theme-label').textContent = theme === 'dark' ? 'Dark' : 'Light';
      toggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', event => {
    if (!preference) apply(event.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    apply(root.dataset.theme);
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(preference);
      try { localStorage.setItem(key, preference); } catch { /* Keep in-memory preference. */ }
    });
    // Enable color transitions only after the initial theme has painted.
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('theme-ready')));
  });
})();
