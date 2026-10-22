/**
 * The browser half of the Apps Script build. Runs before the app, so that the
 * app's own code — the same files the Render site serves — finds what it
 * expects:
 *
 *   - `fetch('/api/…')` answers, through google.script.run instead of HTTP.
 *     Responses come back as real Response objects, so the JSON helpers and
 *     the speaker button's blob work unchanged.
 *
 *   - Routes are paths, as on Render. The page lives in an iframe on another
 *     host, so the path is changed in place there and mirrored into the real
 *     address bar as `?page=…`, which is also what doGet() reads when a link
 *     is opened fresh. Back and forward come back through google.script.history.
 *
 *   - Wallpapers arrive on demand, one photograph at a time, and are kept.
 */

/* global google */

(function () {
  const given = window.__PROFEGPT__;
  const boot = given && typeof given === 'object' ? given : { path: '/', search: '', url: '' };
  const script = window.google && google.script;

  // ------------------------------------------------------------- server ----

  function call(name, ...args) {
    return new Promise((resolve, reject) => {
      script.run.withSuccessHandler(resolve).withFailureHandler(reject)[name](...args);
    });
  }

  const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

  /** Whether the runtime hands back what api() resolves to. See Code.js. */
  let unwrapped = false;

  function requestId() {
    const bytes = crypto.getRandomValues(new Uint8Array(12));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  async function collect(id) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const result = await call('apiResult', id);
      if (result) return result;
      await wait(250 * (attempt + 1));
    }
    throw new Error('The server answered, but its reply was lost.');
  }

  // --------------------------------------------------------------- fetch ----

  const nativeFetch = window.fetch.bind(window);

  function abortError() {
    return new DOMException('The operation was aborted.', 'AbortError');
  }

  function bodyOf(out) {
    if (out.status === 204 || out.status === 304) return null;
    if (typeof out.base64 === 'string') return Uint8Array.from(atob(out.base64), (char) => char.charCodeAt(0));
    return out.body ?? '';
  }

  async function viaServer(target, init) {
    const headers = new Headers(init.headers || {});

    const request = {
      id: requestId(),
      unwrapped,
      method: init.method || 'GET',
      url: target.pathname + target.search,
      headers: Object.fromEntries(headers),
      body: typeof init.body === 'string' ? init.body : undefined,
    };

    let out = await call('api', request);
    if (out && typeof out.status === 'number') unwrapped = true;
    else out = await collect(request.id);

    return new Response(bodyOf(out), { status: out.status, headers: out.headers || {} });
  }

  window.fetch = function (input, init = {}) {
    const url = typeof input === 'string' || input instanceof URL ? String(input) : input.url;
    const target = new URL(url, window.location.href);
    if (target.origin !== window.location.origin || !target.pathname.startsWith('/api/')) {
      return nativeFetch(input, init);
    }

    const { signal } = init;
    if (signal && signal.aborted) return Promise.reject(abortError());

    // The server call cannot be cancelled, but the caller can stop waiting.
    const answer = viaServer(target, init);
    if (!signal) return answer;
    return new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(abortError()), { once: true });
      answer.then(resolve, reject);
    });
  };

  // ------------------------------------------------------------- routing ----

  const nativeReplace = history.replaceState.bind(history);

  /** `/conjugacion?v=ir#top` → the top window's `?page=conjugacion&v=ir#top`. */
  function toTop(url) {
    const target = new URL(url, window.location.href);
    const parameters = {};
    const page = target.pathname.replace(/^\/+|\/+$/g, '');
    if (page) parameters.page = page;
    target.searchParams.forEach((value, key) => { if (key !== 'page') parameters[key] = value; });
    return { parameters, hash: target.hash.replace(/^#/, '') };
  }

  function fromTop(location) {
    const parameters = Object.assign({}, location.parameter || {});
    const page = parameters.page || '';
    delete parameters.page;
    const search = new URLSearchParams(parameters).toString();
    return `/${page}${search ? `?${search}` : ''}${location.hash ? `#${location.hash}` : ''}`;
  }

  /** A link that works outside this frame, for opening in a new tab. */
  function topUrl(url) {
    const { parameters, hash } = toTop(url);
    const search = new URLSearchParams(parameters).toString();
    return `${boot.url}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
  }

  function mirror(kind, url) {
    if (!script || !script.history || url === undefined || url === null) return;
    const { parameters, hash } = toTop(url);
    script.history[kind](null, parameters, hash);
  }

  try { nativeReplace({}, '', boot.path + boot.search); } catch { /* stays on / */ }

  // The frame's own history never grows: the entry belongs to the top window,
  // where the back button is.
  history.pushState = function (state, title, url) {
    nativeReplace(state, title, url);
    mirror('push', url);
  };
  history.replaceState = function (state, title, url) {
    nativeReplace(state, title, url);
    mirror('replace', url);
  };

  // If doGet's route never arrived, the address bar still has it.
  if (given !== boot && script && script.url) {
    script.url.getLocation((location) => {
      const target = fromTop(location);
      if (target === '/') return;
      nativeReplace({}, '', target);
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });
  }

  if (script && script.history) {
    script.history.setChangeHandler((event) => {
      nativeReplace(event.state, '', fromTop(event.location));
      window.dispatchEvent(new PopStateEvent('popstate', { state: event.state }));
    });
  }

  // Internal links the app does not route itself (inside a chat answer, say)
  // would otherwise load the frame's host at that path, which is nothing.
  // Modified clicks open a real address in a new tab instead of a dead one.
  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href.startsWith('/') || href.startsWith('//')) return;

    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      event.preventDefault();
      window.open(topUrl(href), '_blank', 'noopener');
      return;
    }
    if (!link.hasAttribute('data-link') && !link.target) link.setAttribute('data-link', '');
  }, true);

  // ------------------------------------------------------- no-keys notice ----

  // Temporary: says so while the script has no API keys at all, and goes away
  // by itself once any key is in its script properties.
  const NOTICE = {
    es: 'Aviso: esta versión aún no tiene claves de API, así que el traductor y la pronunciación están desactivados por ahora. La web completa está en ',
    fr: 'À noter : cette version n’a pas encore de clés d’API ; le traducteur et la prononciation sont désactivés pour l’instant. Le site complet est sur ',
    it: 'Nota: questa versione non ha ancora chiavi API, quindi il traduttore e la pronuncia per ora sono disattivati. Il sito completo è su ',
    en: 'Note: this version has no API keys yet, so the translator and pronunciation are off for now. The full site is at ',
  };
  const WEBSITE = 'https://profegpt.onrender.com';

  function showNotice() {
    const lang = document.documentElement.lang;
    const bar = document.createElement('div');
    bar.className = 'keys-notice';
    bar.setAttribute('role', 'status');
    bar.append(NOTICE[lang] || NOTICE.en);
    bar.appendChild(Object.assign(document.createElement('a'), {
      href: WEBSITE, target: '_blank', rel: 'noopener', textContent: new URL(WEBSITE).host,
    }));
    bar.append('.');
    const style = document.createElement('style');
    style.textContent = '.keys-notice{position:relative;z-index:41;padding:10px 16px;border-bottom:1px solid var(--line);'
      + 'background:var(--bg);color:var(--text);font-size:13px;line-height:1.5;text-align:center}.keys-notice a{color:inherit}';
    document.head.appendChild(style);
    document.body.prepend(bar);
  }

  if (script) {
    window.fetch('/api/health')
      .then((response) => response.json())
      .then((health) => { if (health.apiKeys === 0) showNotice(); })
      .catch(() => {});
  }

  // ----------------------------------------------------------- wallpaper ----

  const CITY = { es: 'madrid', fr: 'paris', it: 'rome' };
  const VERSION = '__ASSET_VERSION__';
  const requested = new Set();

  function show(name, data) {
    document.documentElement.style.setProperty(`--asset-${name}`, `url("data:image/webp;base64,${data}")`);
  }

  function load(name) {
    if (requested.has(name) || !script) return;
    requested.add(name);
    const key = `profegpt:asset:${name}:${VERSION}`;
    try {
      const kept = localStorage.getItem(key);
      if (kept) { show(name, kept); return; }
    } catch { /* fetch it */ }

    call('asset', name).then((data) => {
      if (!data) return;
      show(name, data);
      try { localStorage.setItem(key, data); } catch { /* fetched again next visit */ }
    }).catch(() => requested.delete(name));
  }

  function current() {
    const root = document.documentElement;
    return `${CITY[root.dataset.study] || 'madrid'}-${root.dataset.theme === 'light' ? 'day' : 'night'}`;
  }

  load(current());
  new MutationObserver(() => load(current()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-study', 'data-theme'] });
})();
