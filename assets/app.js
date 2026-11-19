/* SOUP Docs: package navigation is loaded from the generated catalog. */
const catalogFile = 'packages/catalog.md';
const packageDevelopmentFile = 'development/packages.md';
const tutorialAnchor = 'build-a-complete-package';
const CONFIG = {
  githubUrl: 'https://github.com/soup-ocpm/soup', // Replace with your SOUP repository URL.
  groups: [
    { title: 'Start here', pages: [
      { title: 'Introduction', file: 'index.md' },
      { title: 'Getting started', file: 'getting-started/index.md' },
      { title: 'Installation', file: 'getting-started/installation.md' }
    ]},
    { title: 'Core concepts', pages: [
      { title: 'Architecture', file: 'concepts/architecture.md' },
      { title: 'Datasets & workspaces', file: 'concepts/datasets.md' },
      { title: 'Graph backends', file: 'concepts/graph-backends.md' }
    ]},
    { title: 'Packages', pages: [
      { title: 'Package overview', file: 'packages/index.md' },
      { title: 'Catalog', file: catalogFile }
    ]},
    { title: 'Contributing', pages: [
      { title: 'Package development', file: packageDevelopmentFile },
      { title: 'Edit documentation', file: 'development/documentation.md' },
    ]}
  ]
};
const pages = CONFIG.groups.flatMap(group => group.pages.map(page => ({ ...page, group: group.title })));
const elements = {
  article: document.getElementById('article'), nav: document.getElementById('sidebar-nav'),
  toc: document.getElementById('toc-links'), crumbs: document.getElementById('breadcrumbs'),
  pager: document.getElementById('bottom-navigation'), sidebar: document.getElementById('sidebar'),
  overlay: document.getElementById('mobile-overlay'), menu: document.getElementById('menu-toggle'),
  searchLayer: document.getElementById('search-layer'), searchInput: document.getElementById('search-input'),
  results: document.getElementById('search-results')
};
const cache = new Map();
const detailsPrefix = 'packages/details/';
const slug = file => {
  if (file.startsWith(detailsPrefix)) return file;
  return file === 'index.md' ? '' : file.replace(/\.md$/, '').replace(/\/index$/, '');
};
const encodePath = file => file.split('/').map(encodeURIComponent).join('/');
const pageHref = page => '#/' + encodePath(slug(page.file));
const htmlEscape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const packagePages = new Map();
let catalogRegistration;
let mermaidModule;
let diagramCount = 0;

function pageForSlug(value) {
  const page = pages.find(page => slug(page.file) === value);
  if (page || !value?.startsWith('packages/')) return page;
  const legacyFile = value.slice('packages/'.length);
  return packagePages.get(detailsPrefix + legacyFile) ?? packagePages.get(detailsPrefix + legacyFile + '.md');
}

function navLink(page, activeFile) {
  const active = page.file === activeFile;
  return `<a class="nav-link${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''} href="${pageHref(page)}">${htmlEscape(page.title)}</a>`;
}

function renderNav(activeFile) {
  elements.nav.innerHTML = CONFIG.groups.map(group => {
    const links = group.pages.map(page => {
      const link = navLink(page, activeFile);
      if (page.file === packageDevelopmentFile) {
        const href = pageHref(page) + '#' + tutorialAnchor;
        return `${link}<ul class="nav-packages"><li><a class="nav-link" href="${href}">Build a complete package</a></li></ul>`;
      }
      if (page.file !== catalogFile || !packagePages.size) return link;
      const children = [...packagePages.values()].map(entry => `<li>${navLink(entry, activeFile)}</li>`).join('');
      return `${link}<ul class="nav-packages">${children}</ul>`;
    }).join('');
    return `<section class="nav-group"><div class="nav-group-label">${htmlEscape(group.title)}</div>${links}</section>`;
  }).join('');
}

async function registerPackagePages() {
  const source = await loadMarkdown(catalogFile);
  const template = document.createElement('template');
  template.innerHTML = renderMarkdown(source, catalogFile);
  for (const row of template.content.querySelectorAll('tbody tr')) {
    const anchor = row.cells[0]?.querySelector('a[href^="#/packages/details/"]');
    if (!anchor) continue;
    const file = decodeURIComponent(anchor.getAttribute('href').slice(2).split('#')[0]);
    if (!/\.md$/i.test(file) || packagePages.has(file)) continue;
    packagePages.set(file, {file, title: anchor.textContent.trim(), group: 'Packages'});
  }
  pages.splice(pages.findIndex(page => page.file === catalogFile) + 1, 0, ...packagePages.values());
}

function ensurePackagePages() {
  catalogRegistration ??= registerPackagePages().catch(error => {
    console.warn('Unable to register packages from the catalog.', error);
    catalogRegistration = undefined;
  });
  return catalogRegistration;
}
function closeMenu() { elements.sidebar.classList.remove('open'); elements.overlay.classList.remove('visible'); elements.menu.setAttribute('aria-expanded', 'false'); }
function toggleMenu() { const open = elements.sidebar.classList.toggle('open'); elements.overlay.classList.toggle('visible', open); elements.menu.setAttribute('aria-expanded', String(open)); }

async function loadMarkdown(file, refresh = false) {
  if (!refresh && cache.has(file)) return cache.get(file);
  const response = await fetch('docs/' + encodePath(file), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${file}`);
  const source = await response.text(); cache.set(file, source); return source;
}
function normalizeRelativeLink(link, fromFile) {
  if (!link || /^(?:[a-z][a-z\d+.-]*:|[\/#])/i.test(link)) return null;
  const [encodedPath, anchor] = link.split('#');
  let path;
  try { path = decodeURIComponent(encodedPath); } catch { return null; }
  if (!path || !/\.md$/i.test(path) && !path.endsWith('/')) return null;
  const parts = fromFile.split('/').slice(0,-1);
  for (const component of path.split('/')) {
    if (component === '..') {
      if (!parts.length) return null;
      parts.pop();
    }
    else if (component && component !== '.') parts.push(component);
  }
  const result = parts.join('/');
  const candidates = /\.md$/i.test(result) ? [result] : [result + '.md', result + '/index.md'];
  const matched = pages.find(page => candidates.includes(page.file));
  const file = candidates.at(-1);
  const href = matched ? pageHref(matched) : '#/' + encodePath(file);
  return href + (anchor ? '#' + anchor : '');
}
function renderMarkdown(source, file) {
  if (!window.marked) throw new Error('Markdown renderer unavailable. Check your internet connection or bundle marked locally.');
  const html = window.marked.parse(source, { gfm: true, breaks: false });
  const template = document.createElement('template'); template.innerHTML = html;
  template.content.querySelectorAll('a[href]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    const rewritten = normalizeRelativeLink(href, file);
    if (rewritten) anchor.setAttribute('href', rewritten);
    if (/^https?:/i.test(href)) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
  });
  template.content.querySelectorAll('h2,h3').forEach(heading => {
    const id = heading.textContent.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    heading.id = id;
  });
  return template.innerHTML;
}

async function loadMermaid() {
  const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.esm.min.mjs');
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true });
  return mermaid;
}

async function renderDiagrams() {
  const blocks = elements.article.querySelectorAll('pre > code.language-mermaid');
  if (!blocks.length) return;

  mermaidModule ??= loadMermaid().catch(error => {
    console.warn('Unable to load Mermaid.', error);
    mermaidModule = undefined;
    return null;
  });
  const mermaid = await mermaidModule;
  if (!mermaid) return;

  for (const block of blocks) {
    if (!block.isConnected) return;
    try {
      const { svg } = await mermaid.render(`soup-diagram-${++diagramCount}`, block.textContent);
      if (!block.isConnected) return;
      const figure = document.createElement('figure');
      figure.className = 'doc-diagram';
      figure.innerHTML = svg;
      block.parentElement.replaceWith(figure);
    } catch (error) {
      console.warn('Unable to render a Mermaid diagram.', error);
    }
  }
}

function makeToc() {
  const headings = [...elements.article.querySelectorAll('h2,h3')];
  elements.toc.innerHTML = headings.map(heading => `<a class="level-${heading.tagName.slice(1)}" href="#${heading.id}">${htmlEscape(heading.textContent)}</a>`).join('');
  elements.toc.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', event => {
    event.preventDefault(); document.getElementById(anchor.hash.slice(1))?.scrollIntoView({behavior:'smooth'});
  }));
}
function renderPager(index) {
  const prev = pages[index-1], next = pages[index+1];
  elements.pager.innerHTML = `<div>${prev ? `<a href="${pageHref(prev)}"><span>← Previous</span>${htmlEscape(prev.title)}</a>` : ''}</div><div style="text-align:right">${next ? `<a href="${pageHref(next)}"><span>Next →</span>${htmlEscape(next.title)}</a>` : ''}</div>`;
}
async function route() {
  const hash = location.hash;
  await ensurePackagePages();
  if (hash !== location.hash) return;
  let routeName = '';
  try { routeName = decodeURIComponent(hash.slice(2).split(/[?#]/)[0]).replace(/\/$/, ''); }
  catch { routeName = null; }
  if (/^packages\/(?:details\/)?tutorial(?:\.md)?$/.test(routeName)) {
    location.replace('#/development/packages#' + tutorialAnchor);
    return;
  }
  const page = pageForSlug(routeName);
  const linkedFile = routeName?.endsWith('.md') && routeName.split('/').every(part =>
    part && part !== '.' && part !== '..' && !part.includes('\\')
  ) ? routeName : null;
  const file = page?.file ?? linkedFile;
  closeMenu();
  if (!file) {
    elements.article.innerHTML = '<h1>Page not found</h1><p>This page does not exist. <a href="#/">Return to documentation home</a>.</p>';
    elements.toc.innerHTML = ''; elements.pager.innerHTML = ''; renderNav(null); return;
  }
  renderNav(page?.file);
  try {
    const markdown = await loadMarkdown(file, file !== catalogFile);
    if (hash !== location.hash) return;
    elements.article.innerHTML = renderMarkdown(markdown, file);
    const title = page?.title ?? (elements.article.querySelector('h1')?.textContent || file.split('/').at(-1).slice(0, -3));
    const group = page ? `<span class="sep">/</span><span>${htmlEscape(page.group)}</span>` : '';
    elements.crumbs.innerHTML = `<a href="#/">Docs</a>${group}<span class="sep">/</span><span>${htmlEscape(title)}</span>`;
    document.title = `${title} — SOUP Docs`;
    makeToc();
    if (page) renderPager(pages.indexOf(page));
    else elements.pager.innerHTML = '';
    await renderDiagrams();
    if (hash !== location.hash) return;
  } catch (error) {
    if (hash !== location.hash) return;
    elements.article.innerHTML = `<h1>Unable to load documentation</h1><p>${htmlEscape(error.message)}</p><p>Open this site through a web server, not as a local <code>file://</code> URL.</p>`;
    elements.toc.innerHTML = ''; elements.pager.innerHTML = '';
  }
  const anchor = hash.slice(2).split('#')[1];
  const heading = anchor && document.getElementById(anchor);
  if (heading) heading.scrollIntoView();
  else window.scrollTo({top:0,behavior:'instant'});
}

function openSearch() {
  elements.searchLayer.hidden = false;
  elements.searchInput.value = '';
  search('');
  elements.searchInput.focus();
}
function closeSearch() { elements.searchLayer.hidden = true; }
async function search(query) {
  await ensurePackagePages();
  const normalized = query.trim().toLowerCase();
  const matches = pages.filter(page => !normalized || `${page.title} ${page.group}`.toLowerCase().includes(normalized));
  if (normalized.length > 1) {
    // Load all files once; afterward searching is entirely local in the browser.
    await Promise.all(pages.map(page => loadMarkdown(page.file).catch(() => '')));
    pages.forEach(page => {
      if (!matches.includes(page) && cache.get(page.file)?.toLowerCase().includes(normalized)) matches.push(page);
    });
  }
  if (elements.searchInput.value.trim().toLowerCase() !== normalized) return;
  elements.results.innerHTML = matches.length ? matches.slice(0,20).map(page => `<button type="button" class="search-item" data-page="${htmlEscape(page.file)}"><strong>${htmlEscape(page.title)}</strong><small>${htmlEscape(page.group)}</small></button>`).join('') : '<div class="search-empty">No results found.</div>';
}
elements.menu.addEventListener('click', toggleMenu);
elements.overlay.addEventListener('click', closeMenu);
document.getElementById('search-trigger').addEventListener('click', openSearch);
document.getElementById('search-close').addEventListener('click', closeSearch);
document.getElementById('search-backdrop').addEventListener('click', closeSearch);
elements.searchInput.addEventListener('input', event => search(event.target.value));
elements.results.addEventListener('click', event => { const button = event.target.closest('[data-page]'); if (!button) return; const page = pages.find(p => p.file === button.dataset.page); if (page) { location.hash = pageHref(page); closeSearch(); } });
elements.searchInput.addEventListener('keydown', event => { if (event.key === 'Enter') elements.results.querySelector('.search-item')?.click(); });
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  if (event.key === 'Escape') { closeSearch(); closeMenu(); }
});
window.addEventListener('hashchange', route);
document.getElementById('github-link').href = CONFIG.githubUrl;
route();
