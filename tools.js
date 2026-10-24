/*
 * Ortak araç çekmecesi (float buton + drawer).
 *
 * Kullanım: her sayfanın </body> öncesine şunu ekle:
 *   <script src="tools.js" data-current="image" defer></script>
 * data-current değeri: region | image | video | download  (açık olan sayfayı vurgular)
 *
 * Yeni tool eklemek için aşağıdaki TOOLS listesine bir satır eklemen yeterli.
 */
(() => {
  const TOOLS = [
    { id: 'region', icon: '🌍', name: 'Region Check', desc: 'VPN / bölge tutarlılığı kontrolü', href: './' },
    { id: 'image',  icon: '🖼️', name: 'Image Bypass', desc: 'Resme gren, yumuşatma, metadata temizliği', href: 'imagebypass.html' },
    { id: 'video',  icon: '🎬', name: 'Video Bypass', desc: 'Videoya gren, yumuşatma, metadata temizliği', href: 'videobypass.html' },
    { id: 'download', icon: '⬇️', name: 'Video İndir', desc: 'TikTok / Instagram / darkugc linkinden kırpıp indir', href: 'videoindir.html' },
  ];

  const current = (document.currentScript && document.currentScript.dataset.current) || '';

  const css = `
  .td-root { --td-bg:#ffffff; --td-text:#17181c; --td-muted:#666d7a; --td-line:#e3e5ea; --td-hover:#f1f2f5;
    --td-accent:#17181c; --td-accent-ink:#ffffff; --td-mark:#0f9d74; }
  @media (prefers-color-scheme: dark) {
    .td-root { --td-bg:#1a1c21; --td-text:#f1f2f4; --td-muted:#9aa1ae; --td-line:#2c2f37; --td-hover:#23262d;
      --td-accent:#f1f2f4; --td-accent-ink:#17181c; --td-mark:#7cf0c6; }
  }
  .td-root, .td-root * { box-sizing: border-box; }
  .td-fab {
    position: fixed; right: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border: 0; border-radius: 999px;
    background: var(--td-accent); color: var(--td-accent-ink); font: 600 14.5px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    box-shadow: 0 6px 20px rgba(0,0,0,.25); cursor: pointer; -webkit-tap-highlight-color: transparent;
  }
  .td-fab:active { transform: scale(.97); }
  .td-fab:focus-visible, .td-close:focus-visible, .td-item:focus-visible { outline: 3px solid var(--td-mark); outline-offset: 2px; }
  .td-fab svg { width: 18px; height: 18px; }
  .td-back {
    position: fixed; inset: 0; z-index: 2147483001; background: rgba(0,0,0,.45);
    opacity: 0; visibility: hidden; transition: opacity .2s, visibility .2s;
  }
  .td-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 2147483002; width: min(86vw, 330px);
    background: var(--td-bg); color: var(--td-text); border-left: 1px solid var(--td-line);
    padding: calc(18px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom));
    display: flex; flex-direction: column; gap: 6px; overflow-y: auto;
    transform: translateX(104%); visibility: hidden; transition: transform .24s ease, visibility .24s;
    font: 15px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    box-shadow: -10px 0 30px rgba(0,0,0,.2);
  }
  .td-root.td-open .td-back { opacity: 1; visibility: visible; }
  .td-root.td-open .td-drawer { transform: none; visibility: visible; }
  .td-head { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 8px; }
  .td-head h2 { margin: 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--td-muted); }
  .td-close { border: 0; background: transparent; color: var(--td-muted); font-size: 22px; line-height: 1; padding: 6px 10px; border-radius: 8px; cursor: pointer; }
  .td-close:hover { background: var(--td-hover); }
  .td-item {
    display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 12px; text-decoration: none;
    color: inherit; border: 1px solid transparent;
  }
  .td-item:hover { background: var(--td-hover); }
  .td-item[aria-current="page"] { border-color: var(--td-line); background: var(--td-hover); }
  .td-ico { flex: 0 0 38px; height: 38px; display: grid; place-items: center; font-size: 20px; border-radius: 10px; background: var(--td-hover); }
  .td-item b { display: block; font-weight: 600; }
  .td-item small { display: block; color: var(--td-muted); font-size: 12.5px; }
  .td-here { margin-left: auto; font-size: 11px; font-weight: 600; color: var(--td-mark); }
  @media (prefers-reduced-motion: reduce) { .td-back, .td-drawer { transition: none; } }
  `;

  function build() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.className = 'td-root';
    root.innerHTML = `
      <button class="td-fab" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="td-drawer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        Araçlar
      </button>
      <div class="td-back" data-td-close></div>
      <nav class="td-drawer" id="td-drawer" role="dialog" aria-modal="true" aria-label="Araçlar" tabindex="-1">
        <div class="td-head"><h2>Araçlar</h2><button class="td-close" type="button" aria-label="Kapat" data-td-close>×</button></div>
        <div class="td-list"></div>
      </nav>`;

    const list = root.querySelector('.td-list');
    for (const t of TOOLS) {
      const a = document.createElement('a');
      a.className = 'td-item';
      a.href = t.href;
      if (t.id === current) a.setAttribute('aria-current', 'page');
      const ico = document.createElement('span'); ico.className = 'td-ico'; ico.textContent = t.icon; ico.setAttribute('aria-hidden', 'true');
      const txt = document.createElement('span');
      const b = document.createElement('b'); b.textContent = t.name;
      const s = document.createElement('small'); s.textContent = t.desc;
      txt.append(b, s);
      a.append(ico, txt);
      if (t.id === current) { const h = document.createElement('span'); h.className = 'td-here'; h.textContent = 'Açık'; a.append(h); }
      list.appendChild(a);
    }
    document.body.appendChild(root);

    const fab = root.querySelector('.td-fab');
    const drawer = root.querySelector('.td-drawer');
    let prevOverflow = '';

    function open() {
      root.classList.add('td-open');
      fab.setAttribute('aria-expanded', 'true');
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      drawer.focus();
    }
    function close() {
      if (!root.classList.contains('td-open')) return;
      root.classList.remove('td-open');
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = prevOverflow;
      fab.focus();
    }
    fab.addEventListener('click', () => (root.classList.contains('td-open') ? close() : open()));
    root.addEventListener('click', e => { if (e.target.closest('[data-td-close]')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    // Sayfa geri/ileri önbelleğinden dönülürse çekmece kapalı gelsin
    window.addEventListener('pageshow', () => { root.classList.remove('td-open'); document.body.style.overflow = prevOverflow; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
