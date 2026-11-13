# Editing this website

This documentation is a **static website** built with HTML, CSS and a little JavaScript.
 Each page is a simple Markdown file inside `docs/`.

## Update an existing page

1. Open the relevant `.md` file in `docs/`.
2. Make your changes using Markdown.
3. Commit and push to GitHub. GitHub Pages serves the updated files directly.

For example, edit `docs/packages/graph-explorer.md` to update the Graph Explorer guide.

## Add a page

1. Create a new Markdown file, such as `docs/guides/my-guide.md`.
2. Open `assets/app.js` and add an entry to the `CONFIG.groups` navigation array:

```javascript
{ title: 'My guide', file: 'guides/my-guide.md' }
```

3. Commit your changes. The sidebar and search will pick up the new page.

## Change the appearance

Edit `assets/styles.css`. The CSS variables at the top control the main colors and sizes. Update `index.html` for layout changes.

## Preview locally

From the project root, start a basic static server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` in your browser. Opening `index.html` directly as `file://` will not load Markdown files due to browser restrictions.

## About Markdown rendering

Markdown is rendered in the browser using the small **Marked** library loaded from a CDN. No package manager or compilation is involved; an internet connection is needed to fetch the renderer unless you vendor it locally.
