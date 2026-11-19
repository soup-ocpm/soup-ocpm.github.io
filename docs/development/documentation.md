# Editing this website

This documentation is a **static website** built with HTML, CSS and a little JavaScript.
 Each page is a simple Markdown file inside `docs/`.

## Update an existing page

1. Open the relevant `.md` file in `docs/`.
2. Make your changes using Markdown.
3. Commit and push to GitHub. GitHub Pages serves the updated files directly.

For example, edit `docs/packages/details/graph-explorer.md` to update the Graph Explorer guide.

## Add a page

1. Create a new Markdown file, such as `docs/guides/my-guide.md`.
2. Link to it from another Markdown page using a relative path.
3. To include the page in the sidebar and site search, open `assets/app.js` and add an entry to `CONFIG.groups`:

```javascript
{ title: 'My guide', file: 'guides/my-guide.md' }
```

## Add a package guide

Add a Markdown file anywhere under `docs/packages/details/`. The generator uses the first level-one heading as its title and the filename if there is no heading. The catalog, sidebar, and search are populated automatically.

The publishing workflow regenerates `docs/packages/catalog.md` on pushes to `main`. The repository's Pages publishing source needs to be set to **GitHub Actions**. Run `python3 scripts/package_catalog.py` if you want to refresh the generated file in your checkout.

## Change the appearance

Edit `assets/styles.css`. The CSS variables at the top control the main colors and sizes. Update `index.html` for layout changes.

## Preview locally

From the project root, start the preview server:

```bash
python3 scripts/package_catalog.py --serve
```

Open `http://127.0.0.1:8000/` in your browser. Reload the page to see additions or removals in the package catalog. Opening `index.html` directly as `file://` will not load Markdown files due to browser restrictions.

## About Markdown rendering

Markdown is rendered in the browser using the small **Marked** library loaded from a CDN. No package manager or compilation is involved; an internet connection is needed to fetch the renderer unless you vendor it locally.
