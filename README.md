# Block YouTube Shorts

A Chrome extension that blocks YouTube Shorts without affecting regular YouTube. Any navigation to a `/shorts/` URL (e.g. `https://www.youtube.com/shorts/VIDEO_ID`) is redirected to the main YouTube homepage.

## How it works

- **declarativeNetRequest**: blocks direct loads of `youtube.com/shorts` (e.g. from the address bar, bookmarks, or external links) by redirecting to `https://www.youtube.com`.
- **Content script** (on www, m, and bare youtube.com): when you’re already on YouTube and click a Short (home feed, search, etc.), the site switches to `/shorts/` **without a full page reload**. The content script:
  - Checks on load and redirects if you land on `/shorts/`.
  - Listens for YouTube’s `yt-navigate-finish` and redirects when a Shorts view is opened.
  - Uses a short polling fallback so `/shorts/` is caught even if that event doesn’t fire.
  - Removes **Shorts shelves/rows** in feeds (including the YouTube Home page) so Shorts thumbnails don’t appear in the first place.
- Only **top-level** YouTube is affected; normal `youtube.com/watch?v=...` and embedded players keep working.

## Installation (unpacked)

1. Open Chrome and go to `chrome://extensions/`.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked**.
4. Choose this project folder

The extension will stay active until you remove or disable it.

## Usage

No setup needed. Once installed, opening a Shorts link like:

- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID`
- `https://m.youtube.com/shorts/VIDEO_ID`

will redirect you to `https://www.youtube.com`. The same happens when you click a Short from the YouTube home feed or elsewhere on the site. Regular URLs such as `youtube.com/watch?v=...` are unchanged.

## Optional: hard block

The default action is **redirect**. To **block** Shorts entirely (browser “site can’t be reached”-style page), change the rule in `rules.json` from:

```json
"action": {
  "type": "redirect",
  "redirect": { "url": "https://www.youtube.com" }
}
```

to:

```json
"action": { "type": "block" }
```

Then reload the extension in `chrome://extensions/`.

## Files

- `manifest.json` – Extension manifest (Manifest V3) and content script registration.
- `rules.json` – declarativeNetRequest rules for `youtube.com/shorts` URLs.
- `content.js` – Content script that catches in‑page navigations to `/shorts/` (e.g. from the home feed).
- `README.md` – This file.

## Adding icons (optional)

To set icons, add a folder `icons/` with:

- `icon48.png` (48×48)
- `icon128.png` (128×128)

and in `manifest.json` add:

```json
"icons": {
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```
