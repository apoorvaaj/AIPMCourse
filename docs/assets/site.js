/* AI Product Management Programme · shared site script
   Loaded in the <head> of every page. It handles sign-in state, the top navigation,
   the learner-only gate, self-paced unlocking and email submission.

   ===== Course owner: edit these settings only. ===== */
window.SITE = {
  supabaseUrl: '',            // e.g. https://abcdefgh.supabase.co  (empty = preview mode, code 123456)
  supabaseAnonKey: '',        // the "anon" / publishable key. Never the service role key.
  submitEmail: 'aipmcourse@aspira.work',   // where learners email summative work
  publishedModules: 6,        // highest module number with a page (module-01.html, module-02.html …)
  whyUrl: 'https://apoorvaaj.github.io/learn-ai-product-management.html',
  loginPage: 'login.html',
  homePage: 'dashboard.html'
};
/* ===== End of settings ===== */

(function () {
  const S = window.SITE, root = document.documentElement;
  const LIVE = !!(S.supabaseUrl && S.supabaseAnonKey);
  const access = root.dataset.access || 'public';            // 'public' or 'learner'
  const modNum = root.dataset.module != null ? +root.dataset.module : null; // 0 = Week 0
  const PAGE = location.pathname.split('/').pop() || 'index.html';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ls = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* Course-owner override for reviewing pages: add ?unlock=all to any URL (and ?unlock=none to undo). */
  try {
    const q = new URLSearchParams(location.search).get('unlock');
    if (q === 'all') ls.set('aipm:unlock-all', true);
    if (q === 'none') ls.del('aipm:unlock-all');
  } catch (e) {}

  /* Hide learner pages until the sign-in check finishes, so nothing flashes before a redirect. */
  if (access === 'learner') {
    root.classList.add('gating');
    const st = document.createElement('style');
    st.textContent = 'html.gating body{visibility:hidden}';
    document.head.appendChild(st);
  }

  /* ---------- Sign-in ---------- */
  let clientP = null;
  function client() {
    if (!LIVE) return Promise.resolve(null);
    if (!clientP) clientP = new Promise((resolve, reject) => {
      const go = () => resolve(window.supabase.createClient(S.supabaseUrl, S.supabaseAnonKey));
      if (window.supabase) return go();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
      s.onload = go; s.onerror = () => reject(new Error('network'));
      document.head.appendChild(s);
    });
    return clientP;
  }
  async function session() {
    if (!LIVE) { const e = ls.get('aipm:preview-session'); return e ? { email: e } : null; }
    try {
      const c = await client(); const { data } = await c.auth.getSession();
      return data && data.session ? { email: data.session.user.email } : null;
    } catch (e) { return null; }
  }
  const auth = {
    async sendCode(email) {
      if (!LIVE) return { error: null };
      try { const c = await client(); return await c.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }); }
      catch (e) { return { error: { message: 'network' } }; }
    },
    async verify(email, token) {
      if (!LIVE) {
        if (token === '123456') { ls.set('aipm:preview-session', email); return { error: null, email }; }
        return { error: { message: 'invalid token' } };
      }
      try {
        const c = await client(); const r = await c.auth.verifyOtp({ email, token, type: 'email' });
        return r.error ? { error: r.error } : { error: null, email: (r.data.user && r.data.user.email) || email };
      } catch (e) { return { error: { message: 'network' } }; }
    },
    async signOut() {
      ls.del('aipm:preview-session');
      if (LIVE) { try { const c = await client(); await c.auth.signOut(); } catch (e) {} }
    }
  };

  /* ---------- Self-paced unlocking (progress is kept in this browser) ---------- */
  const submitted = key => !!ls.get('aipm:submitted:' + key);       // key: 'w0', 'm1', 'm2' …
  function progress(n) {                                             // summary written by each module page
    const p = ls.get('progress:m' + n);
    const out = p ? Object.assign({}, p) : null;
    return submitted('m' + n) ? Object.assign(out || {}, { deliverable: 'submitted' }) : out;
  }
  const unlockAll = () => !!ls.get('aipm:unlock-all');
  function requirements(n) {
    if (n <= 0) return [];
    if (n === 1) return [['Week 0 baseline emailed to the course team', submitted('w0')]];
    const p = progress(n - 1) || {};
    return [
      [`Module ${n - 1}: Checkpoint quiz A at mastery`, !!(p.qa && p.qa.mast)],
      [`Module ${n - 1}: Checkpoint quiz B at mastery`, !!(p.qb && p.qb.mast)],
      [`Module ${n - 1}: assignment emailed to the course team`, submitted('m' + (n - 1))]
    ];
  }
  const isUnlocked = n => unlockAll() || requirements(n).every(r => r[1]);
  const pageFor = n => n === 0 ? 'week-00.html' : `module-${String(n).padStart(2, '0')}.html`;
  const nameFor = n => n === 0 ? 'Week 0' : `Module ${n}`;

  /* ---------- Navigation ---------- */
  function navHTML(user) {
    const cur = h => (h === PAGE || (h === './' && PAGE === 'index.html')) ? ' aria-current="page"' : '';
    const why = `<a class="ext" href="${esc(S.whyUrl)}">Why this course</a>`;
    if (!user) return `${why}<a href="./"${cur('./')}>Syllabus</a><a class="signin" href="${esc(S.loginPage)}"${cur(S.loginPage)}>Sign in</a>`;
    return `<a href="${esc(S.homePage)}"${cur(S.homePage)}>My course</a><a href="./"${cur('./')}>Syllabus</a>${why}` +
      `<span class="navwho"><span title="${esc(user.email)}">${esc(user.email)}</span><button type="button" class="navout">Sign out</button></span>`;
  }
  function applyNav(user) {
    document.querySelectorAll('nav[data-site-nav]').forEach(n => {
      n.innerHTML = navHTML(user);
      const b = n.querySelector('.navout');
      if (b) b.addEventListener('click', async () => { await auth.signOut(); location.href = S.loginPage; });
    });
  }
  function markLinks() {
    document.querySelectorAll('a[href]').forEach(a => {
      const m = (a.getAttribute('href') || '').match(/^(?:week-00|module-(\d\d))\.html/);
      if (!m) return;
      const n = m[1] ? +m[1] : 0, locked = !isUnlocked(n);
      a.classList.toggle('is-locked', locked);
      if (locked) a.title = 'Locked until: ' + requirements(n).filter(r => !r[1]).map(r => r[0]).join('; ');
      else a.removeAttribute('title');
    });
  }
  function fillEmail() {
    document.querySelectorAll('[data-submit-email]').forEach(el => {
      el.textContent = S.submitEmail;
      if (el.tagName === 'A') el.href = 'mailto:' + S.submitEmail;
    });
  }

  /* ---------- Locked page ---------- */
  function lockScreen(n) {
    const wrap = document.querySelector('.wrap'); if (!wrap) return;
    wrap.hidden = true;
    const prev = n === 1 ? 0 : n - 1;
    const box = document.createElement('div');
    box.className = 'wrap lockwrap';
    box.innerHTML = `<nav class="top" data-site-nav aria-label="Course pages"></nav>
<div class="lockpanel"><p class="eyebrow">Locked</p><h1>${nameFor(n)} is not open yet</h1>
<p class="lede">The course is self-paced. Each part opens when you finish the one before it.</p>
<ul class="reqs">${requirements(n).map(r => `<li class="${r[1] ? 'ok' : 'todo'}"><span class="mark" aria-hidden="true">${r[1] ? '✓' : '○'}</span><span>${esc(r[0])}<span class="sr">${r[1] ? ' (done)' : ' (not yet)'}</span></span></li>`).join('')}</ul>
<div class="cta"><a class="primary" href="${pageFor(prev)}">Go to ${nameFor(prev)}</a><a href="${esc(S.homePage)}">My course</a></div></div>`;
    wrap.parentNode.insertBefore(box, wrap);
  }

  /* ---------- Email submission ---------- */
  function wireSubmission(user) {
    const box = document.querySelector('[data-submit]'); if (!box) return;
    const key = box.dataset.submit, subject = box.dataset.subject;
    const nextN = key === 'w0' ? 1 : +key.slice(1) + 1;
    const btn = box.querySelector('#email-sub'), sent = box.querySelector('#sent'), msg = box.querySelector('#sent-msg');
    const who = user ? user.email : 'learner';
    btn.addEventListener('click', () => {
      const copy = document.getElementById('copy'); if (copy) copy.click();
      const body = `Hello,\n\nPlease find my ${subject} below.${key === 'w0' ? '' : ' My document is attached.'}\n\nSigned-in email: ${who}\n\n--- Paste your work here (it has been copied to your clipboard) ---\n\n`;
      setTimeout(() => { location.href = `mailto:${S.submitEmail}?subject=${encodeURIComponent('AIPM · ' + subject + ' · ' + who)}&body=${encodeURIComponent(body)}`; }, 250);
    });
    const show = () => {
      if (!sent.checked) { msg.textContent = ''; return; }
      msg.textContent = nextN > S.publishedModules ? `Recorded. Module ${nextN} will open here when it is published.`
        : isUnlocked(nextN) ? `Recorded. ${nameFor(nextN)} is now open.`
        : `Recorded. ${nameFor(nextN)} opens once both checkpoint quizzes on this page are at mastery.`;
    };
    sent.checked = submitted(key);
    sent.addEventListener('change', () => {
      if (sent.checked) ls.set('aipm:submitted:' + key, new Date().toISOString()); else ls.del('aipm:submitted:' + key);
      show(); markLinks();
    });
    show();
  }

  /* ---------- Start ---------- */
  const ready = session().then(user => {
    S.user = user;
    if (user) root.classList.add('signed-in');
    if (access === 'learner' && !user) {
      location.replace(S.loginPage + '?next=' + encodeURIComponent(PAGE + location.hash));
      return new Promise(() => {});
    }
    const run = () => {
      if (access === 'learner' && modNum != null && !isUnlocked(modNum)) lockScreen(modNum);
      applyNav(user); fillEmail(); markLinks(); wireSubmission(user);
      root.classList.remove('gating');
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    return user;
  });

  window.Site = { ready, auth, client, live: LIVE, progress, submitted, isUnlocked, requirements, unlockAll, pageFor };
})();
