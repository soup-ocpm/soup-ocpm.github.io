/* SOUP Docs: no build step, no framework. Edit PAGES to update navigation. */
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
      { title: 'Graph Explorer', file: 'packages/graph-explorer.md' }
    ]},
    { title: 'Contributing', pages: [
      { title: 'Package development', file: 'development/packages.md' },
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
const slug = file => file === 'index.md' ? '' : file.replace(/\.md$/, '').replace(/\/index$/, '');
const pageHref = page => '#/' + slug(page.file);
const htmlEscape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const currentSlug = () => decodeURIComponent(location.hash.slice(2).split('?')[0] || '').replace(/\/$/, '');
const pageForSlug = value => pages.find(page => slug(page.file) === value) || null;

function renderNav(activeFile) {
  elements.nav.innerHTML = CONFIG.groups.map(group => `<section class="nav-group"><div class="nav-group-label">${htmlEscape(group.title)}</div>${group.pages.map(page => `<a class="nav-link ${page.file === activeFile ? 'active' : ''}" ${page.file === activeFile ? 'aria-current="page"' : ''} href="${pageHref(page)}">${htmlEscape(page.title)}</a>`).join('')}</section>`).join('');
}
function closeMenu() { elements.sidebar.classList.remove('open'); elements.overlay.classList.remove('visible'); elements.menu.setAttribute('aria-expanded', 'false'); }
function toggleMenu() { const open = elements.sidebar.classList.toggle('open'); elements.overlay.classList.toggle('visible', open); elements.menu.setAttribute('aria-expanded', String(open)); }

async function loadMarkdown(file) {
  if (cache.has(file)) return cache.get(file);
  const response = await fetch('docs/' + file);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${file}`);
  const source = await response.text(); cache.set(file, source); return source;
}
function normalizeRelativeLink(link, fromFile) {
  if (!link || /^(https?:|mailto:|tel:|data:|#\/)/i.test(link)) return null;
  if (link.startsWith('#')) return null;
  const [path, anchor] = link.split('#');
  if (!path || !path.endsWith('.md') && !path.endsWith('/')) return null;
  let parts = fromFile.split('/').slice(0,-1);
  for (const component of path.split('/')) {
    if (component === '..') parts.pop();
    else if (component && component !== '.') parts.push(component);
  }
  const result = parts.join('/');
  const candidates = result.endsWith('.md') ? [result] : [result + '.md', result + '/index.md'];
  const matched = pages.find(page => candidates.includes(page.file));
  return matched ? pageHref(matched) + (anchor ? '#' + anchor : '') : null;
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
  const routeName = currentSlug();
  const page = pageForSlug(routeName);
  closeMenu();
  if (!page) {
    elements.article.innerHTML = '<h1>Page not found</h1><p>This page does not exist. <a href="#/">Return to documentation home</a>.</p>';
    elements.toc.innerHTML = ''; elements.pager.innerHTML = ''; renderNav(null); return;
  }
  renderNav(page.file);
  elements.crumbs.innerHTML = `<a href="#/">Docs</a><span class="sep">/</span><span>${htmlEscape(page.group)}</span><span class="sep">/</span><span>${htmlEscape(page.title)}</span>`;
  document.title = `${page.title} — SOUP Docs`;
  try {
    const markdown = await loadMarkdown(page.file);
    if (page !== pageForSlug(currentSlug())) return;
    elements.article.innerHTML = renderMarkdown(markdown, page.file);
    makeToc(); renderPager(pages.indexOf(page));
  } catch (error) {
    elements.article.innerHTML = `<h1>Unable to load documentation</h1><p>${htmlEscape(error.message)}</p><p>Open this site through a web server, not as a local <code>file://</code> URL.</p>`;
    elements.toc.innerHTML = ''; elements.pager.innerHTML = '';
  }
  window.scrollTo({top:0,behavior:'instant'});
}

function openSearch() {
  elements.searchLayer.hidden = false;
  elements.searchInput.value = '';
  search('');
  elements.searchInput.focus();
}
function closeSearch() { elements.searchLayer.hidden = true; }
async function search(query) {
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
