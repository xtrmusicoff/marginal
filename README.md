# Marginal — Markdown studio

Open `index.html` directly in Chrome, Edge, or Firefox. No build, server, or account required.

## Features
- Live side-by-side Markdown editor and preview; stacked layout on phones.
- Headings, lists, task lists, links, tables, quotes, and fenced code blocks.
- Automatic local draft storage (including empty drafts), with graceful failure when browser storage is unavailable.
- Load sample, clear with confirmation, and download the exact source as `untitled.md`.
- Word/character count and a small Markdown reference.
- Light/forest-dark themes with an animated sun/moon switch in the header, smooth page color transitions, and a gentle staggered entrance. Reduced-motion preferences disable these animations.
- Theme follows your system until you choose one; your choice is stored separately from your draft. Theme initialization runs before styles load to avoid a wrong-theme flash and works independently of CDN availability.
- Sanitized preview: scripts, unsafe link protocols, styles, embedded documents, images, and other remote resources are excluded. Links open in a separate tab with opener/referrer protection. Code blocks use plain monospace text, not syntax highlighting.

## Dependencies and privacy
Pinned Marked 18.2.0 and DOMPurify 3.4.17 load from jsDelivr. Optional Google Fonts load from Google; system font fallbacks work if unavailable. Internet is required to load the preview libraries. If loading fails, editing and downloading remain available and the preview explains the problem.

Document text is processed locally and is not sent to these services. The font/CDN providers still receive ordinary resource requests. Following a link is an explicit navigation to its destination.

Browser storage is not a backup and is specific to the browser/profile/origin. Behavior for `file:` URLs can vary by browser. Download important drafts before clearing browser data or moving the app. Do not put sensitive material in shared-browser drafts.

## Verification
An isolated Playwright smoke check is in `.test-tools/smoke.cjs`; it uses installed Google Chrome and opens the real HTML page directly. From this folder:

```sh
npm install --prefix .test-tools --no-save --package-lock=false playwright
node .test-tools/smoke.cjs
node .test-tools/theme.cjs
```

The smoke check covers live formatting, nested lists/code/tables, draft restoration including empty drafts, unsafe HTML sanitization, confirmation cancel/accept, sample reset, exact downloaded contents, phone layout/overflow, unavailable libraries, blocked storage, and page errors. Desktop/mobile screenshots are saved under `.test-tools/` for visual review. The app itself does not depend on the test tooling.
