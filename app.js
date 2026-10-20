/* Learnb — uygulama mantığı.
   Dersler Mia (Claude) tarafından ilk açılışta hazırlanır ve kişiye özel kayda yazılır;
   cevap kontrolü, sohbet ve kelime anlamları da Mia'ya sorulur. */
(() => {
  'use strict';

  const D = window.LEARNB_DATA;

  // ---------- Müfredat ----------
  const LESSONS = [];
  const unitCount = {};
  D.units.forEach(u => {
    unitCount[u.level] = (unitCount[u.level] || 0) + 1;
    u.n = unitCount[u.level];
    u.ids = u.lessons.map(([id]) => id);
  });
  const perLevel = {};
  D.units.forEach(u => u.lessons.forEach(([id, t, g, f]) => {
    perLevel[u.level] = (perLevel[u.level] || 0) + 1;
    LESSONS.push({ id, t, g, f, level: u.level, unit: u, idx: LESSONS.length, n: perLevel[u.level] });
  }));
  const byId = Object.fromEntries(LESSONS.map(l => [l.id, l]));
  const LEVEL = Object.fromEntries(D.levels.map(l => [l.id, l]));

  // ---------- Küçük yardımcılar ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const fine = () => window.matchMedia && matchMedia('(pointer: fine)').matches;
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
  // **kelime** → vurgulu; satır sonları korunur
  const fmt = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<mark>$1</mark>').replace(/\n/g, '<br>');
  // İngilizce metindeki her kelimeyi dokunulabilir yapar
  const wordify = s => String(s ?? '').split(/([A-Za-z][A-Za-z'’-]*)/).map((p, i) => (i % 2 ? `<span class="w">${esc(p)}</span>` : esc(p))).join('');
  const gapHtml = s => esc(s).replace('___', '<span class="gap" aria-label="boşluk"></span>');
  const capFirst = s => s.charAt(0).toUpperCase() + s.slice(1);

  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  const today = () => ymd(new Date());
  function addDays(s, n) { const [y, m, d] = s.split('-').map(Number); return ymd(new Date(y, m - 1, d + n)); }

  // Karşılaştırma için sadeleştirme: küçük harf, kısaltmalar açık, noktalama yok
  const CONTR = [
    [/\bcan't\b/g, 'cannot'], [/\bcan not\b/g, 'cannot'], [/\bwon't\b/g, 'will not'], [/\bshan't\b/g, 'shall not'],
    [/\b(\w+)n't\b/g, '$1 not'], [/\bi'm\b/g, 'i am'], [/\b(you|we|they)'re\b/g, '$1 are'],
    [/\b(he|she|it|that|there|what|where|who|here)'s\b/g, '$1 is'], [/\b(i|you|we|they)'ve\b/g, '$1 have'],
    [/\b(i|you|we|they|he|she|it)'ll\b/g, '$1 will'], [/\b(i|you|we|they|he|she)'d\b/g, '$1 would'], [/\blet's\b/g, 'let us']
  ];
  function norm(s) {
    let t = String(s ?? '').toLowerCase().replace(/[’‘`´]/g, "'");
    CONTR.forEach(([r, v]) => { t = t.replace(r, v); });
    return t.replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Öğretmen kalemi: cevaptaki yanlışları çizer, doğrusunu el yazısıyla ekler
  const TOK = /[A-Za-zÀ-ÿĞğİıŞşÇçÖöÜü0-9'’-]+|[^\sA-Za-zÀ-ÿĞğİıŞşÇçÖöÜü0-9'’-]/g;
  function diffHtml(a, b) {
    const A = String(a ?? '').match(TOK) || [], B = String(b ?? '').match(TOK) || [];
    const n = A.length, m = B.length;
    const T = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) T[i][j] = A[i] === B[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    const out = []; let i = 0, j = 0;
    while (i < n && j < m) {
      if (A[i] === B[j]) { out.push(['=', A[i++]]); j++; }
      else if (T[i + 1][j] >= T[i][j + 1]) out.push(['-', A[i++]]);
      else out.push(['+', B[j++]]);
    }
    while (i < n) out.push(['-', A[i++]]);
    while (j < m) out.push(['+', B[j++]]);
    const punct = t => /^[.,!?;:)]$/.test(t);
    return out.map(([op, t], k) => {
      const sp = k && !punct(t) ? ' ' : '';
      return sp + (op === '=' ? esc(t) : op === '-' ? `<del>${esc(t)}</del>` : `<ins>${esc(t)}</ins>`);
    }).join('');
  }

  const ICON = {
    back: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    flame: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 3.2 5 5.2 5 10a5 5 0 0 1-10 0c0-2.2 1-3.6 2-4.6 0 2 1 3 2 3 0-3-1-5.2 1-8.4z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>',
    more: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>'
  };
  const starsHtml = n => `<span class="stars" aria-label="${n} yıldız">${[1, 2, 3].map(k => `<span class="${k <= n ? '' : 'off'}">${ICON.star}</span>`).join('')}</span>`;
  const PRAISE = ['Doğru!', 'Harika!', 'Çok iyi!', 'Aynen öyle!', 'Süper!'];

  // ---------- Claude bağlantısı ----------
  const P = { sample: null, db: null, user: null, perms: null, uid: null, mode: 'local', inViewer: false };
  async function connect() {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    P.inViewer = true;
    const [sample, db, user, perms] = await Promise.all(['sample', 'db', 'user', 'permissions'].map(n => window.claude.use(n).catch(() => null)));
    Object.assign(P, { sample, db, user, perms });
    if (db && user) { try { P.uid = await user.id(); } catch (e) { P.uid = null; } }
    if (P.db && P.uid) P.mode = 'db';
  }

  function errText(code) {
    switch (code) {
      case 'not_granted': return 'Mia\'nın çalışması için bu sayfanın Claude hesabını kullanmasına izin vermelisin. Ayarlar\'daki "İzinleri yönet" düğmesinden açabilirsin.';
      case 'sampling_disabled': case 'capability_disabled': case 'capability_removed': case 'not_declared': return 'Bu hesapta ya da bu görünümde Mia\'yı çalıştıramıyorum.';
      case 'rate_limited': return AI.provider() === 'gemini'
        ? 'Google\'ın ücretsiz kullanım sınırına takıldın. Bir dakika bekleyip tekrar dene; günlük sınır dolduysa ertesi gün sıfırlanır.'
        : 'Şu an çok fazla istek gitti ya da Claude kullanım limitin doldu. Biraz bekleyip tekrar dene.';
      case 'session_expired': return 'Oturumun kapanmış. claude.ai\'ye yeniden giriş yapıp sayfayı yenile.';
      case 'no_key': return 'Mia\'nın çalışması için Ayarlar\'a Google Gemini anahtarını girmen gerekiyor.';
      case 'bad_key': return 'Google anahtarı kabul etmedi. Ayarlar\'dan anahtarı kontrol et.';
      case 'no_model': return 'Bu anahtarla kullanılabilecek ücretsiz bir Gemini modeli bulamadım. Ayarlar\'dan başka bir model seçmeyi dene.';
      case 'bad_request': return 'Google bu isteği kabul etmedi. Ayarlar\'dan başka bir model seçmeyi dene.';
      case 'network': return 'İnternete bağlanamadım. Bağlantını kontrol edip tekrar dene.';
      case 'refused': return 'Bu isteğe cevap veremedim. Farklı bir şekilde dener misin?';
      default: return 'Bir şeyler ters gitti. Tekrar dener misin?';
    }
  }

  // ---------- Yapay zekâ: claude.ai içinde Claude, masaüstünde Google Gemini ----------
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
  const G = { key: lsGet('learnb.gkey') || '', model: lsGet('learnb.gmodel') || '', models: [], base: 'https://generativelanguage.googleapis.com/v1beta/' };
  const jsonCache = new Map();

  function httpCode(status, msg) {
    if (status === 400) return /api key/i.test(msg) ? 'bad_key' : 'bad_request';
    if (status === 401 || status === 403) return 'bad_key';
    if (status === 404) return 'no_model';
    if (status === 429) return 'rate_limited';
    return 'upstream_error';
  }
  async function gFetch(url, init) {
    let res;
    try { res = await fetch(url, init); }
    catch (e) { throw { code: e && e.name === 'AbortError' ? 'cancelled' : 'network' }; }
    if (!res.ok) {
      let msg = '';
      try { const j = await res.json(); msg = (j && j.error && j.error.message) || ''; } catch (e) { /* gövde yok */ }
      throw { code: httpCode(res.status, msg), status: res.status, message: msg };
    }
    return res;
  }
  // Modelin "düşünme" kısmını atıp sadece cevap metnini alır
  function readParts(j) {
    if (j && j.promptFeedback && j.promptFeedback.blockReason) throw { code: 'refused' };
    const c = j && j.candidates && j.candidates[0];
    const text = ((c && c.content && c.content.parts) || []).filter(p => !p.thought).map(p => p.text || '').join('');
    return { text, finish: (c && c.finishReason) || '' };
  }
  function gemBody(input, { tier, json }) {
    const turns = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
    const contents = [];
    turns.forEach(t => {
      const role = t.role === 'assistant' ? 'model' : 'user';
      const last = contents[contents.length - 1];
      if (last && last.role === role) last.parts[0].text += '\n\n' + t.content;
      else contents.push({ role, parts: [{ text: t.content }] });
    });
    const gc = { temperature: json ? 0.3 : 0.8 };
    if (json) gc.responseMimeType = 'application/json';
    if (tier === 'quick' && lsGet('learnb.gnothink') !== G.model) {
      if (/2\.5-flash/.test(G.model)) gc.thinkingConfig = { thinkingBudget: 0 };
      else if (/^gemini-[3-9]/.test(G.model)) gc.thinkingConfig = { thinkingLevel: 'low' };
    }
    return { contents, generationConfig: gc };
  }
  async function gem(body, { onText } = {}) {
    const url = `${G.base}models/${encodeURIComponent(G.model)}:${onText ? 'streamGenerateContent?alt=sse' : 'generateContent'}`;
    const res = await gFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': G.key }, body: JSON.stringify(body) });
    if (!onText) {
      const r = readParts(await res.json());
      if (!r.text.trim()) throw { code: r.finish === 'SAFETY' ? 'refused' : 'empty_completion' };
      return { text: r.text, truncated: r.finish === 'MAX_TOKENS' };
    }
    const reader = res.body.getReader(), dec = new TextDecoder();
    let buf = '', text = '', finish = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim();
        buf = buf.slice(i + 1);
        if (!line.startsWith('data:')) continue;
        let j;
        try { j = JSON.parse(line.slice(5).trim()); } catch (e) { continue; }
        const r = readParts(j);
        if (r.finish) finish = r.finish;
        if (r.text) { text += r.text; onText({ text, delta: r.text }); }
      }
    }
    if (!text.trim()) throw { code: finish === 'SAFETY' ? 'refused' : 'empty_completion' };
    return { text, truncated: finish === 'MAX_TOKENS' };
  }
  async function listModels() {
    const res = await gFetch(`${G.base}models?pageSize=200`, { headers: { 'x-goog-api-key': G.key } });
    const j = await res.json();
    G.models = ((j && j.models) || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => String(m.name).replace(/^models\//, ''));
    return G.models;
  }
  // Ücretsiz katmanda en çok "flash" modelleri var: en yeni flash önce, sonra flash-lite
  function rankModels(list) {
    const score = n => {
      if (!/^gemini-/.test(n) || /(image|tts|live|audio|embed|vision|robotic|computer|native|learnlm|gemma)/.test(n)) return -1;
      const v = parseFloat((n.match(/^gemini-(\d+(?:\.\d+)?)/) || [])[1] || '0');
      let s = v * 100;
      if (/flash-lite/.test(n)) s += 10; else if (/flash/.test(n)) s += 30; else return -1;
      if (/preview|exp/.test(n)) s -= 40;
      if (/latest/.test(n)) s -= 5;
      return s;
    };
    return list.filter(n => score(n) > 0).sort((a, b) => score(b) - score(a));
  }
  async function pickModel() {
    const ranked = rankModels(await listModels());
    if (!ranked.length) throw { code: 'no_model' };
    G.model = ranked[0];
    lsSet('learnb.gmodel', G.model);
  }
  // Anahtarı kaydeder ve kısa bir deneme isteğiyle çalışan bir model bulur
  async function setupGemini(key) {
    const old = { ...G };
    G.key = key;
    try {
      const ranked = rankModels(await listModels());
      let last = { code: 'no_model' };
      for (const m of ranked.slice(0, 5)) {
        G.model = m;
        try {
          await gem(gemBody('Reply with only the word OK.', { tier: 'quick' }));
          lsSet('learnb.gkey', key); lsSet('learnb.gmodel', m);
          return m;
        } catch (e) {
          if (e.code === 'bad_key' || e.code === 'network') throw e;
          if (e.code === 'bad_request') { try { await gem(gemBody('Reply with only the word OK.', {})); lsSet('learnb.gkey', key); lsSet('learnb.gmodel', m); lsSet('learnb.gnothink', m); return m; } catch (e2) { last = e2; continue; } }
          last = e;
        }
      }
      throw last;
    } catch (e) { Object.assign(G, old); throw e; }
  }
  async function gemCall(input, { tier, onText, json }) {
    if (!G.key) throw { code: 'no_key' };
    if (!G.model) await pickModel();
    const body = gemBody(input, { tier, json });
    try { return await gem(body, { onText }); }
    catch (e) {
      // Bazı modeller "düşünme" ayarını tanımaz: ayarsız bir kez daha dene
      if (e.code === 'bad_request' && body.generationConfig.thinkingConfig) {
        delete body.generationConfig.thinkingConfig;
        const r = await gem(body, { onText });
        lsSet('learnb.gnothink', G.model); // bu model ayarı tanımıyor: bir daha gönderme
        return r;
      }
      throw e;
    }
  }
  function parseJsonLoose(text) {
    const t = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    try { return JSON.parse(t); } catch (e) { /* aşağıda dene */ }
    const starts = ['{', '['].map(c => t.indexOf(c)).filter(i => i >= 0);
    const a = starts.length ? Math.min(...starts) : -1, b = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
    if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { /* düşmez */ } }
    throw { code: 'invalid_json' };
  }
  const AI = {
    ready: () => !!(P.sample || G.key),
    provider: () => (P.sample ? 'claude' : 'gemini'),
    async text(input, { tier = 'default', onText, fresh } = {}) {
      if (P.sample) { const o = { modelTier: tier }; if (onText) o.onText = onText; if (fresh) o.cache = false; return P.sample(input, o); }
      return gemCall(input, { tier, onText });
    },
    async json(input, { tier = 'default', fresh, cacheKey } = {}) {
      if (P.sample) { const o = { modelTier: tier }; if (fresh) o.cache = false; else if (cacheKey) o.cache = { gcTime: 86400000 }; return P.sample.json(input, o); }
      if (cacheKey && jsonCache.has(cacheKey)) return jsonCache.get(cacheKey);
      const v = parseJsonLoose((await gemCall(input, { tier, json: true })).text);
      if (cacheKey) jsonCache.set(cacheKey, v);
      return v;
    }
  };

  // ---------- Kayıt ----------
  const Store = {
    pending: {}, busy: {},
    path(name) { return `data/users/${P.uid}/${name}`; },
    async load(name) {
      if (P.mode === 'db') {
        try { const s = await P.db.doc(this.path(name)).get(); return s.exists ? JSON.parse(JSON.stringify(s.data())) : null; }
        catch (e) { console.warn('Learnb: okunamadı', name, e); return null; }
      }
      try { const v = localStorage.getItem('learnb.' + name); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    },
    save(name, obj) {
      const data = JSON.parse(JSON.stringify(obj));
      if (P.mode !== 'db') { try { localStorage.setItem('learnb.' + name, JSON.stringify(data)); } catch (e) { /* tarayıcı kaydı kapalı */ } return Promise.resolve(); }
      this.pending[name] = data;
      if (!this.busy[name]) this.busy[name] = this.flush(name);
      return this.busy[name];
    },
    async flush(name) {
      while (this.pending[name]) {
        const data = this.pending[name];
        delete this.pending[name];
        try { await P.db.doc(this.path(name)).set(data); }
        catch (e) {
          if (e && e.code === 'unavailable') {
            await sleep(700 + Math.random() * 900);
            try { await P.db.doc(this.path(name)).set(data); } catch (e2) { saveFailed(e2); }
          } else saveFailed(e);
        }
      }
      delete this.busy[name];
    },
    async remove(name) {
      if (P.mode === 'db') { try { await P.db.doc(this.path(name)).delete(); } catch (e) { saveFailed(e); } return; }
      try { localStorage.removeItem('learnb.' + name); } catch (e) { /* yok say */ }
    }
  };
  function saveFailed(e) {
    console.warn('Learnb: kaydedilemedi', e);
    toast(e && e.code === 'quota_exceeded' ? 'Kayıt alanı doldu. Defterindeki eski hataları temizlemeyi dene.' : 'Son değişiklik kaydedilemedi. İnternet bağlantını kontrol et.');
  }
  const RESUME = 'learnb.resume';
  function getResume() { try { return JSON.parse(localStorage.getItem(RESUME) || 'null'); } catch (e) { return null; } }
  function setResume(v) { try { v ? localStorage.setItem(RESUME, JSON.stringify(v)) : localStorage.removeItem(RESUME); } catch (e) { /* yok say */ } }

  // ---------- Durum ----------
  const S = { profile: null, vocab: { words: {} }, mistakes: { items: [] }, loading: true, tab: 'home', homeLevel: null, notesTab: 'words', docs: {}, chat: null };
  let L = null;       // açık ders
  let THREAD = null;  // mesajların yazıldığı sayfa

  function newProfile(level) {
    const first = LESSONS.find(l => l.level === level) || LESSONS[0];
    return { v: 1, level, start: first.idx, tier: 'quick', streak: { n: 0, last: null }, done: {}, created: today() };
  }
  const tier = () => (S.profile && S.profile.tier === 'careful' ? 'default' : 'quick');
  function streakNow() {
    const s = S.profile && S.profile.streak;
    if (!s || !s.last) return 0;
    const t = today();
    return s.last === t || s.last === addDays(t, -1) ? s.n : 0;
  }
  const doneMap = () => (S.profile && S.profile.done) || {};
  function nextLesson() {
    const done = doneMap(), start = S.profile ? S.profile.start || 0 : 0;
    for (let i = start; i < LESSONS.length; i++) if (!done[LESSONS[i].id]) return LESSONS[i];
    return LESSONS.find(l => !done[l.id]) || null;
  }
  const chatLevel = () => { const n = nextLesson(); return (n && n.level) || (S.profile && S.profile.level) || 'A2'; };
  const dueWords = () => Object.values(S.vocab.words).filter(w => (w.due || '') <= today());

  function addWord(w, lessonId) {
    const en = String(w.en || '').trim(), key = en.toLowerCase();
    if (!en || S.vocab.words[key] || Object.keys(S.vocab.words).length >= 1500) return false;
    S.vocab.words[key] = { en, tr: String(w.tr || '').trim(), ex: String(w.ex || '').trim(), l: lessonId || '', box: 0, due: today(), added: today() };
    return true;
  }
  function addMistakes(list) {
    if (!list.length) return;
    S.mistakes.items = list.concat(S.mistakes.items).slice(0, 150);
    Store.save('mistakes', S.mistakes);
  }

  // ---------- Ekran iskeleti ----------
  function setChrome({ top, nav = true, dock = false }) {
    $('#top').innerHTML = top;
    const d = $('#dock');
    d.hidden = !dock;
    if (!dock) d.innerHTML = '';
    $('#nav').hidden = !nav;
    const tab = S.tab === 'review' ? 'notes' : S.tab;
    $$('#nav [data-tab]').forEach(b => b.setAttribute('aria-current', b.dataset.tab === tab ? 'page' : 'false'));
    hidePop();
  }
  function topMain(title) {
    const st = streakNow();
    return `<div class="wrap top-row">
      <div class="brand">${title ? `<span class="brand-sub">${esc(title)}</span>` : 'Learn<span class="b">b</span>'}</div>
      <div class="top-actions">
        <span class="chip ${st ? 'on' : ''}" title="Üst üste ders yaptığın gün sayısı">${ICON.flame}<b>${st}</b> gün</span>
        <button class="icon-btn" type="button" data-act="settings" aria-label="Ayarlar">${ICON.sliders}</button>
      </div></div>`;
  }
  const topBack = (title, sub, act = 'home') => `<div class="wrap top-row">
      <button class="icon-btn" type="button" data-act="${act}" aria-label="Geri">${ICON.back}</button>
      <div class="top-title">${sub ? `<small>${esc(sub)}</small>` : ''}<b>${esc(title)}</b></div></div>`;
  const main = () => { const m = $('#main'); m.scrollTop = 0; return m; };

  // ---------- Ana sayfa ----------
  function greet() {
    const hr = new Date().getHours();
    return hr < 5 ? 'İyi geceler' : hr < 12 ? 'Günaydın' : hr < 18 ? 'İyi günler' : hr < 23 ? 'İyi akşamlar' : 'İyi geceler';
  }
  function notice() {
    if (S.loading) return '';
    if (!AI.ready()) return setupCard();
    return '';
  }
  function setupCard() {
    return `<div class="setup-card"><p class="tag">Kurulum</p><h2>Mia'yı çalıştıralım</h2>
      <p>Mia'nın ders hazırlaması, cevaplarını kontrol etmesi ve seninle yazışması için ücretsiz bir Google Gemini anahtarı gerekiyor. Bir kere girmen yeterli.</p>
      <button class="btn primary" type="button" data-act="settings">Anahtarı gir</button></div>`;
  }
  function renderHome() {
    S.tab = 'home';
    if (!S.loading && !S.profile) return renderOnboarding();
    setChrome({ top: topMain(), nav: true });
    const m = main(); m.className = 'main';
    const done = doneMap(), nx = nextLesson();
    const lvl = S.homeLevel || (nx ? nx.level : 'A1');
    const doneToday = Object.values(done).some(d => d.at === today());
    const due = dueWords().length;
    const dis = S.loading ? 'disabled' : '';
    m.innerHTML = `<div class="wrap home">
      ${notice()}
      <section class="hello">
        <p class="eyebrow">${S.loading ? 'Bağlanıyor…' : greet()}</p>
        <h1>${doneToday ? 'Bugünkü dersini yaptın. Harika gidiyorsun!' : 'Bugün bir ders yapalım mı?'}</h1>
        <p class="stats"><span><b>${streakNow()}</b> gün seri</span><span><b>${Object.keys(done).length}</b> ders bitti</span><span><b>${Object.keys(S.vocab.words).length}</b> kelime</span></p>
      </section>
      ${nx ? `<button class="next-card" type="button" data-open="${nx.id}" ${dis}>
          <span class="ribbon" aria-hidden="true"></span>
          <span class="nc-label">Sıradaki ders · ${nx.level} ${esc(LEVEL[nx.level].name)} · Ders ${nx.n}</span>
          <span class="nc-title">${esc(nx.t)}</span>
          <span class="nc-goal">${esc(nx.g)}</span>
          <span class="btn primary">${getResume() && getResume().id === nx.id ? 'Kaldığın yerden devam et' : 'Derse başla'}</span>
        </button>` : `<div class="next-card"><span class="nc-title">Bütün dersleri bitirdin!</span><span class="nc-goal">Sohbet bölümünde pratik yapmaya ya da kelimelerini tekrar etmeye devam edebilirsin.</span></div>`}
      ${due ? `<div class="due-card"><p><b>${due}</b> kelimenin tekrar zamanı geldi.</p><button class="btn ghost" type="button" data-act="review">Tekrar et</button></div>` : ''}
      <div class="levels" role="tablist" aria-label="Seviyeler">${D.levels.map(L2 => {
        const ids = LESSONS.filter(l => l.level === L2.id);
        const c = ids.filter(l => done[l.id]).length;
        return `<button type="button" role="tab" data-level="${L2.id}" aria-selected="${L2.id === lvl}"><b>${L2.id}</b><span>${esc(L2.name)}</span><i>${c}/${ids.length}</i></button>`;
      }).join('')}</div>
      ${D.units.filter(u => u.level === lvl).map(u => `<section class="unit">
        <h2><span class="unit-no">Ünite ${u.n}</span>${esc(u.t)}</h2>
        <ol class="lessons">${u.ids.map(id => {
          const l = byId[id], d = done[id], isNext = nx && nx.id === id;
          return `<li><button type="button" class="lesson-row ${d ? 'done' : ''} ${isNext ? 'next' : ''}" data-open="${id}" ${dis}>
            <span class="ln">${l.n}</span>
            <span class="lt"><b>${esc(l.t)}</b><small>${esc(l.g)}</small></span>
            <span class="ls">${d ? starsHtml(d.stars || 1) : isNext ? '<span class="pill">Sıradaki</span>' : ''}</span>
          </button></li>`;
        }).join('')}</ol></section>`).join('')}
    </div>`;
    $$('[data-level]', m).forEach(b => b.onclick = () => { S.homeLevel = b.dataset.level; renderHome(); });
    $$('[data-open]', m).forEach(b => b.onclick = () => openLesson(b.dataset.open));
  }

  // ---------- Karşılama ve seviye ----------
  function renderOnboarding(change) {
    S.tab = 'home';
    setChrome({ top: change ? topBack('Seviyeni değiştir') : '<div class="wrap top-row"><div class="brand">Learn<span class="b">b</span></div></div>', nav: !!change });
    const m = main(); m.className = 'main';
    m.innerHTML = `<div class="wrap onboard">
      ${change ? '' : `<div class="ob-hero"><div class="av big" aria-hidden="true">M</div><div>
        <h1>Merhaba, ben Mia!</h1>
        <p>Seninle her gün kısa derslerle İngilizce çalışacağız. Her derste yeni bir şey öğrenecek, alıştırma yapacak ve benimle yazışarak pratik yapacaksın. Açıklamaların hepsi Türkçe.</p></div></div>`}
      <h2>Nereden başlayalım?</h2>
      <div class="ob-levels">${D.levels.map(l => `<button class="ob-level" type="button" data-start="${l.id}"><b>${l.id}</b><span><strong>${esc(l.name)}</strong><small>${esc(l.note)}</small></span></button>`).join('')}</div>
      <button class="btn ghost wide" type="button" data-act="placement">Seviyemi bilmiyorum, kısa bir test yapalım (${D.placement.length} soru)</button>
    </div>`;
    $$('[data-start]', m).forEach(b => b.onclick = () => startAt(b.dataset.start));
  }
  function startAt(level) {
    const first = LESSONS.find(l => l.level === level);
    if (S.profile) { S.profile.level = level; S.profile.start = first.idx; }
    else S.profile = newProfile(level);
    Store.save('profile', S.profile);
    S.homeLevel = level;
    renderHome();
  }
  function renderPlacement() {
    S.tab = 'home';
    const qs = D.placement, score = Object.fromEntries(D.levels.map(l => [l.id, 0]));
    const tested = D.levels.filter(l => qs.some(q => q.level === l.id)).map(l => l.id);
    let i = 0;
    setChrome({ top: topBack('Seviye testi', 'Her soruda boşluğa uygun olanı seç', S.profile ? 'home' : 'onboard'), nav: false });
    const m = main(); m.className = 'main';
    const draw = () => {
      if (i >= qs.length) return result();
      const q = qs[i];
      m.innerHTML = `<div class="wrap placement">
        <div class="pl-meta"><span>Soru ${i + 1} / ${qs.length}</span><span>${q.level}</span></div>
        <div class="bar"><i style="width:${(i / qs.length) * 100}%"></i></div>
        <p class="pl-q en">${gapHtml(q.q)}</p>
        <div class="options">${q.o.map((o, k) => `<button class="opt" type="button" data-k="${k}"><span class="key">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div>
        <button class="link" type="button" data-skip>Bilmiyorum, geç</button>
      </div>`;
      $$('.opt', m).forEach(b => b.onclick = () => { if (+b.dataset.k === q.a) score[q.level]++; i++; draw(); });
      $('[data-skip]', m).onclick = () => { i++; draw(); };
    };
    const result = () => {
      const total = Object.values(score).reduce((a, b) => a + b, 0);
      // Bir seviyede 3 ve üstü doğru yapan bir sonraki seviyeden başlar
      let level = 'A1';
      for (let k = 0; k < tested.length - 1; k++) { if (score[tested[k]] >= 3) level = tested[k + 1]; else break; }
      if (total <= 2) level = 'A1';
      m.innerHTML = `<div class="wrap placement">
        <h2>Önerim: ${level} · ${esc(LEVEL[level].name)}</h2>
        <p class="lead">${qs.length} sorudan ${total} tanesini doğru cevapladın. Seviyelere göre sonuçların:</p>
        <ul class="pl-bars">${tested.map(id => { const n = qs.filter(q => q.level === id).length; return `<li><b>${id}</b><span class="bar"><i style="width:${(score[id] / n) * 100}%"></i></span><span>${score[id]}/${n}</span></li>`; }).join('')}</ul>
        <button class="btn primary wide" type="button" data-start="${level}">${level} seviyesinden başla</button>
        <button class="btn ghost wide" type="button" data-other>Başka bir seviye seç</button>
      </div>`;
      $('[data-start]', m).onclick = () => startAt(level);
      $('[data-other]', m).onclick = () => renderOnboarding(!!S.profile);
    };
    draw();
  }

  // ---------- Mesajlar ----------
  function push(el) { if (THREAD) { THREAD.appendChild(el); scrollDown(); } return el; }
  const AV = '<div class="av" aria-hidden="true">M</div>';
  const miaSay = (html, cls = '') => push(h(`<div class="msg mia ${cls}">${AV}<div class="bubble">${html}</div></div>`));
  const miaCard = html => push(h(`<div class="msg mia card-msg">${AV}${html}</div>`));
  const meSay = html => push(h(`<div class="msg me"><div class="bubble">${html}</div></div>`));
  let typingEl = null;
  function showTyping() { hideTyping(); typingEl = miaSay('<span class="dots" aria-label="Mia yazıyor"><i></i><i></i><i></i></span>', 'typing'); }
  function hideTyping() { if (typingEl) typingEl.remove(); typingEl = null; }
  function scrollDown() { const m = $('#main'); requestAnimationFrame(() => m.scrollTo({ top: m.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' })); }
  function miaLine(en, tr) {
    const el = miaSay(`<p class="en big" data-en="${esc(en)}">${wordify(en)}</p>${tr ? `<button class="tr-toggle" type="button">Türkçesi</button><p class="tr" hidden>${esc(tr)}</p>` : ''}`);
    const b = el.querySelector('.tr-toggle');
    if (b) b.onclick = () => { const p = b.nextElementSibling; p.hidden = !p.hidden; b.textContent = p.hidden ? 'Türkçesi' : 'Gizle'; };
    return el;
  }
  function feedback(kind, body, title) {
    const icon = kind === 'ok' ? ICON.check : ICON.x;
    return miaSay(`<p class="verdict">${icon}<b>${esc(title || (kind === 'ok' ? pick(PRAISE) : 'Tam olmadı'))}</b></p>${body}`, kind);
  }

  // ---------- Alt panel ----------
  function setDock(html, wire) { if (L) L.dock = { html, wire }; renderDock({ html, wire }); }
  function renderDock(dk) {
    const d = $('#dock');
    const x = dk || (L && L.dock);
    if (!x) return;
    d.hidden = false;
    d.innerHTML = `<div class="wrap dock-in">${typeof x.html === 'function' ? x.html() : x.html}</div>`;
    if (x.wire) x.wire(d);
    const first = $('.btn.primary:not([disabled])', d);
    if (first && fine() && !$('textarea, input', d)) first.focus({ preventScroll: true });
  }
  const askLink = () => '<button class="link" type="button" data-act="ask">Anlamadığın bir yer mi var? Mia\'ya sor</button>';
  function continueDock(extra = '', wire) {
    setDock(`<div class="dock-row">${extra}<button class="btn primary grow" type="button" data-act="next">Devam et</button></div>`, wire);
  }
  function autoGrow(ta) { const f = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, 160) + 'px'; }; ta.addEventListener('input', f); f(); }
  function enterSubmits(ta, form) { ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } }); }
  function textDock(ph, onSubmit, { extra = '', wire = null, ask = true } = {}) {
    setDock(`<form class="compose" data-f><textarea class="field" rows="1" placeholder="${esc(ph)}" autocapitalize="sentences" spellcheck="false" aria-label="${esc(ph)}"></textarea><button class="btn primary send" aria-label="Gönder">${ICON.send}</button></form>${extra ? `<div class="dock-row">${extra}</div>` : ''}${ask ? askLink() : ''}`, d => {
      const f = $('[data-f]', d), ta = $('textarea', d);
      autoGrow(ta); enterSubmits(ta, f);
      if (fine()) ta.focus({ preventScroll: true });
      f.onsubmit = e => { e.preventDefault(); const v = ta.value.trim(); if (!v) return ta.focus(); ta.value = ''; onSubmit(v); };
      if (wire) wire(d);
    });
  }

  // ---------- Ders ----------
  const str = (v, max = 2000) => (typeof v === 'string' || typeof v === 'number') && String(v).trim() ? String(v).trim().slice(0, max) : '';
  const arr = v => (Array.isArray(v) ? v : []);
  function validateStep(o) {
    if (!o || typeof o !== 'object') return null;
    const t = o.t;
    const opts = list => arr(list).map(x => str(x, 200)).filter(Boolean);
    switch (t) {
      case 'intro': { const text = str(o.text); return text ? { t, text } : null; }
      case 'explain': {
        const body = str(o.body);
        if (!body) return null;
        return { t, title: str(o.title, 120), body, examples: arr(o.examples).map(e => ({ en: str(e && e.en, 300), tr: str(e && e.tr, 300) })).filter(e => e.en).slice(0, 6) };
      }
      case 'choice': {
        const options = opts(o.options), answer = Number(o.answer);
        if (options.length < 2 || !Number.isInteger(answer) || answer < 0 || answer >= options.length) return null;
        if (new Set(options.map(x => x.toLowerCase())).size !== options.length) return null;
        return { t, q: str(o.q, 400) || 'Doğru seçeneği bul.', sentence: str(o.sentence, 300).replace(/_{2,}/g, '___'), options, answer, why: str(o.why, 400) };
      }
      case 'fill': {
        const sentence = str(o.sentence, 300).replace(/_{2,}/g, '___'), answers = opts(o.answers);
        if (!answers.length || (sentence.match(/___/g) || []).length !== 1) return null;
        return { t, q: str(o.q, 300) || 'Boşluğu doldur.', sentence, hint: str(o.hint, 80), answers, why: str(o.why, 400) };
      }
      case 'order': {
        const answer = str(o.answer, 200), n = answer.split(/\s+/).length;
        if (n < 3 || n > 12) return null;
        return { t, q: str(o.q, 300) || 'Kelimeleri sıraya koy.', answer, tr: str(o.tr, 300), alts: opts(o.alts) };
      }
      case 'match': {
        const pairs = arr(o.pairs).map(p => ({ en: str(p && p.en, 80), tr: str(p && p.tr, 80) })).filter(p => p.en && p.tr).slice(0, 6);
        if (pairs.length < 3) return null;
        if (new Set(pairs.map(p => p.en.toLowerCase())).size !== pairs.length || new Set(pairs.map(p => p.tr.toLowerCase())).size !== pairs.length) return null;
        return { t, q: str(o.q, 300) || 'İfadeleri anlamlarıyla eşleştir.', pairs };
      }
      case 'reading': {
        const text = str(o.text, 2500);
        if (!text) return null;
        const questions = arr(o.questions).map(q => {
          const options = opts(q && q.options), a = Number(q && q.answer);
          return str(q && q.q) && options.length >= 2 && Number.isInteger(a) && a >= 0 && a < options.length ? { q: str(q.q, 300), options, answer: a, why: str(q.why, 300) } : null;
        }).filter(Boolean).slice(0, 3);
        return { t, title: str(o.title, 120), text, questions };
      }
      case 'translate': {
        const tr = str(o.tr, 300), answer = str(o.answer, 300);
        return tr && answer ? { t, q: str(o.q, 300) || 'İngilizceye çevir.', tr, answer, alts: opts(o.alts) } : null;
      }
      case 'write': { const q = str(o.q, 400); return q ? { t, q, check: str(o.check, 400), example: str(o.example, 300) } : null; }
      case 'dialogue': {
        const opening = str(o.opening, 400);
        return opening ? { t, scene: str(o.scene, 300), role: str(o.role, 200) || 'Mia, a friendly conversation partner', goal: str(o.goal, 300), opening, opening_tr: str(o.opening_tr, 400) } : null;
      }
      case 'vocab': {
        const words = arr(o.words).map(w => ({ en: str(w && w.en, 80), tr: str(w && w.tr, 120), ex: str(w && w.ex, 200) })).filter(w => w.en && w.tr).slice(0, 12);
        return words.length ? { t, words } : null;
      }
      case 'summary': { const points = arr(o.points).map(p => str(p, 300)).filter(Boolean).slice(0, 5); return points.length ? { t, points } : null; }
      case 'end': return { t };
      default: return null;
    }
  }
  // Bir satırı derse ekler; okuma parçası "metin + sorular" adımlarına bölünür
  function ingest(R, o) {
    const s = validateStep(o);
    if (!s) return;
    if (s.t === 'end') { R.sawEnd = true; return; }
    R.raw.push(s);
    if (s.t === 'vocab') { R.vocab = s; return; }
    if (s.t === 'summary') { R.summary = s; return; }
    if (s.t === 'reading') {
      R.steps.push({ t: 'readtext', title: s.title, text: s.text });
      s.questions.forEach(q => R.steps.push({ t: 'choice', q: q.q, sentence: '', options: q.options, answer: q.answer, why: q.why, reading: true }));
    } else R.steps.push(s);
    if (R === L && R.waiting) { R.waiting = false; hideTyping(); goStep(R.pos); }
  }
  const lessonSteps = R => R.raw.filter(s => s.t !== 'vocab' && s.t !== 'summary').length;
  function saveDoc(lessonId, raw) {
    const doc = { v: 1, at: today(), lines: raw };
    S.docs[lessonId] = doc;
    Store.save('lesson-' + lessonId, doc);
  }
  function parseLines(text, R) {
    String(text || '').split('\n').forEach(line => {
      line = line.trim();
      if (!line || line.startsWith('```')) return;
      try { ingest(R, JSON.parse(line)); } catch (e) { /* bozuk satırı atla */ }
    });
  }

  function lessonPrompt(l) {
    const prev = LESSONS.slice(Math.max(0, l.idx - 18), l.idx).map(x => `- ${x.t}`).join('\n') || '- (this is the very first lesson)';
    const guide = {
      A1: 'Very short, simple sentences (mostly under 8 words) and very common words. Give a Turkish translation for every English example.',
      A2: 'Short everyday sentences and common vocabulary.',
      B1: 'Natural everyday English; explanations can go a little deeper.',
      B2: 'Natural, idiomatic English; explain nuance and register where it matters.',
      C1: 'Rich, precise, idiomatic English as used by educated speakers; explanations focus on nuance, register and why one option is better than another.',
      C2: 'Sophisticated, near-native English including literary and colloquial registers; explanations focus on subtle differences in meaning, tone and effect.'
    }[l.level];
    return `You are writing one lesson of "Learnb", a text-only English course for Turkish speakers. The tutor is Mia: warm, encouraging and concise. Every explanation and instruction is in simple, natural Turkish (address the learner as "sen"). English examples are natural and everyday.

LEVEL: ${l.level} (CEFR). ${guide}
LESSON: ${l.t} — ${l.g}
FOCUS (teach exactly this; it is the one new thing in this lesson): ${l.f}
ALREADY STUDIED (the learner knows these; reuse them freely, do not teach them again):
${prev}

Write the lesson as NDJSON: exactly one JSON object per line and nothing else. No Markdown, no code fences, no blank lines, no comments. Put the lines in this order:
1. one "intro"
2. one "explain" with the core rule
3. two easy exercises
4. a second "explain": the next point the focus needs (a variation, the negative or question form, a nuance, or useful phrases), including a typical mistake Turkish speakers make
5. four exercises that get gradually harder, mixing the types choice, fill, order and match
6. one "reading" that uses the focus
7. one "translate", then one "write"
8. one "dialogue"
9. one "vocab" with 6–8 useful words or phrases from this lesson
10. one "summary"
11. {"t":"end"}

Line formats:
{"t":"intro","text":"Turkish: Mia greets and says in 2 sentences what the learner will learn and why it is useful"}
{"t":"explain","title":"short Turkish title","body":"Turkish, 2–5 short sentences; wrap English words in **double asterisks**; at most one \\n line break","examples":[{"en":"English","tr":"Turkish"}]}   (3–4 examples)
{"t":"choice","q":"Turkish instruction or question","sentence":"English sentence with ___ for the gap, or an empty string","options":["3 or 4 options"],"answer":0,"why":"Turkish, 1 sentence"}
{"t":"fill","q":"Turkish instruction","sentence":"English sentence containing exactly one ___","hint":"short hint, e.g. the base verb or a Turkish word","answers":["every acceptable answer, including contractions"],"why":"Turkish, 1 sentence"}
{"t":"order","q":"Turkish instruction","answer":"one English sentence of 4–9 words","tr":"its Turkish meaning"}
{"t":"match","q":"Turkish instruction","pairs":[{"en":"English","tr":"Turkish"}]}   (exactly 4 pairs, all clearly different)
{"t":"reading","title":"English title","text":"English text of ${l.level === 'A1' ? '3–4' : '4–7'} sentences","questions":[{"q":"Turkish question","options":["3 Turkish options"],"answer":0}]}   (2 questions)
{"t":"translate","q":"Turkish instruction","tr":"one Turkish sentence","answer":"the best English translation","alts":["other correct translations"]}
{"t":"write","q":"Turkish task asking for 1–2 of the learner's own sentences that use the focus","check":"in English: what a correct answer must contain","example":"an English example answer"}
{"t":"dialogue","scene":"Turkish: the situation in one sentence","role":"in English: who Mia plays","goal":"Turkish: what the learner should try to use","opening":"Mia's first line in English, ending with a question","opening_tr":"its Turkish translation"}
{"t":"vocab","words":[{"en":"word or phrase","tr":"Turkish","ex":"short English example"}]}
{"t":"summary","points":["three short Turkish points; wrap English words in **double asterisks**"]}

Rules:
- Every line is valid JSON with double quotes; escape any double quote inside a string.
- "answer" in choice and in reading questions is the 0-based index of the only correct option. Spread the correct answers across different positions.
- Exercises test only this lesson's focus and what was already studied. Every exercise has exactly one clearly correct answer.
- Keep the English at ${l.level} level.`;
  }

  function newRun(lesson) {
    return { lesson, raw: [], steps: [], vocab: null, summary: null, sawEnd: false, streaming: false, failed: null, started: false, pos: 0, graded: 0, correct: 0, waiting: false, newMistakes: [], chat: null, dock: null, finished: false, stars: 1 };
  }
  async function openLesson(id, opts = {}) {
    const lesson = byId[id];
    if (!lesson) return;
    S.tab = 'lesson';
    const R = L = newRun(lesson);
    setChrome({
      top: `<div class="wrap top-row">
        <button class="icon-btn" type="button" data-act="home" aria-label="Derslere dön">${ICON.back}</button>
        <div class="top-title"><small>${lesson.level} · Ünite ${lesson.unit.n} · Ders ${lesson.n}</small><b>${esc(lesson.t)}</b></div>
        <button class="icon-btn" type="button" data-act="lesson-menu" aria-label="Ders seçenekleri">${ICON.more}</button>
      </div><div class="progress"><i></i></div>`,
      nav: false, dock: true
    });
    const m = main(); m.className = 'main';
    m.innerHTML = '<div class="wrap thread-wrap"><div class="thread"></div></div>';
    THREAD = $('.thread', m);
    setDock('<p class="dock-note">Ders açılıyor…</p>');
    if (!opts.fresh && prefetching[id]) {
      miaSay('<p>Bu dersi senin için zaten hazırlıyordum, birazdan hazır.</p>', 'note');
      showTyping();
      await prefetching[id];
      if (L !== R) return;
      hideTyping();
    }
    let doc = opts.fresh ? null : S.docs[id] || await Store.load('lesson-' + id);
    if (L !== R) return;
    if (!doc && !opts.fresh && id === D.starter.id) doc = { lines: [...D.starter.steps, D.starter.vocab, D.starter.summary] };
    if (doc && Array.isArray(doc.lines) && doc.lines.length) {
      S.docs[id] = doc;
      doc.lines.forEach(o => ingest(R, o));
      begin(R, true);
    } else generateLesson(R, opts.fresh);
  }
  function progress() {
    const bar = $('#top .progress i');
    if (!bar || !L) return;
    const total = Math.max(L.steps.length, L.streaming ? 16 : 1);
    bar.style.width = (L.finished ? 100 : Math.max(3, Math.min(97, (L.pos / total) * 100))) + '%';
  }
  function begin(R, fromDoc) {
    if (R !== L || R.started) return;
    R.started = true;
    hideTyping();
    const r = getResume();
    if (!fromDoc && r && r.id === R.lesson.id) setResume(null);
    if (fromDoc && r && r.id === R.lesson.id && r.pos > 1 && r.pos < R.steps.length) {
      miaSay('<p>Bu derse daha önce başlamıştın. Kaldığın yerden devam edelim mi?</p>');
      setDock('<div class="dock-row"><button class="btn ghost" type="button" data-x="restart">Baştan başla</button><button class="btn primary grow" type="button" data-x="resume">Kaldığım yerden devam et</button></div>', d => {
        $('[data-x=restart]', d).onclick = () => { setResume(null); goStep(0); };
        $('[data-x=resume]', d).onclick = () => {
          R.graded = r.graded || 0; R.correct = r.correct || 0; R.newMistakes = Array.isArray(r.mistakes) ? r.mistakes : [];
          const recap = R.steps.slice(0, r.pos).filter(s => s.t === 'explain');
          if (recap.length) { miaSay('<p>Hatırlatma olarak bu dersteki kurallar:</p>'); recap.forEach(renderExplainCard); }
          goStep(r.pos);
        };
      });
      return;
    }
    goStep(0);
  }
  let lastNext = 0;
  function goStep(i) {
    const R = L;
    if (!R || R.finished) return;
    R.pos = i;
    progress();
    if (lessonSteps(R) && i > 0) setResume({ id: R.lesson.id, pos: i, graded: R.graded, correct: R.correct, mistakes: R.newMistakes.slice(-20) });
    if (i >= R.steps.length) {
      if (R.streaming) {
        R.waiting = true;
        showTyping();
        setDock('<p class="dock-note">Mia dersin devamını yazıyor…</p>');
        return;
      }
      return finishLesson();
    }
    const s = R.steps[i];
    (STEP[s.t] || (() => goStep(i + 1)))(s, i);
  }
  const next = () => { const now = Date.now(); if (now - lastNext < 350 || !L) return; lastNext = now; goStep(L.pos + 1); };

  function renderExplainCard(s) {
    return miaCard(`<article class="card rule"><p class="tag">Kural</p>${s.title ? `<h3>${esc(s.title)}</h3>` : ''}<p>${fmt(s.body)}</p>${s.examples.length ? `<ul class="examples">${s.examples.map(ex => `<li data-en="${esc(ex.en)}"><span class="en">${wordify(ex.en)}</span>${ex.tr ? `<span class="tr">${esc(ex.tr)}</span>` : ''}</li>`).join('')}</ul>` : ''}</article>`);
  }
  function record(ok, mistake) {
    L.graded++;
    if (ok) L.correct++;
    if (mistake) { const m = { ...mistake, at: today(), l: L.lesson.id }; L.newMistakes.push(m); return m; }
    return null;
  }
  const appealBtn = '<button class="btn ghost" type="button" data-x="appeal">Bence benimki de doğru</button>';

  const STEP = {
    intro(s, i) {
      miaSay(`<p>${fmt(s.text)}</p>`);
      if (!Object.keys(doneMap()).length && i === 0) miaSay('<p class="hint">İpucu: İngilizce örneklerdeki bir kelimeye dokunursan anlamını gösteririm ve istersen defterine eklerim.</p>', 'note');
      setTimeout(() => { if (L && L.pos === i) goStep(i + 1); }, 450);
    },
    explain(s) {
      renderExplainCard(s);
      setDock(`<div class="dock-row"><button class="btn ghost" type="button" data-act="ask">Mia'ya sor</button><button class="btn primary grow" type="button" data-act="next">Anladım, devam</button></div>`);
    },
    readtext(s) {
      miaSay('<p class="tag">Okuma</p><p>Şu kısa metni oku. Bilmediğin bir kelimeye dokunursan anlamını gösteririm.</p>');
      miaCard(`<article class="card reading" data-en="${esc(s.text)}">${s.title ? `<h3 class="en">${esc(s.title)}</h3>` : ''}<p class="en">${wordify(s.text)}</p></article>`);
      setDock(`<div class="dock-row"><button class="btn ghost" type="button" data-act="ask">Mia'ya sor</button><button class="btn primary grow" type="button" data-act="next">Okudum, sorulara geç</button></div>`);
    },
    choice(s) {
      const order = shuffle(s.options.map((_, k) => k));
      miaSay(`<p class="tag">${s.reading ? 'Okuma sorusu' : 'Seçmeli'}</p><p>${fmt(s.q)}</p>${s.sentence ? `<p class="en big">${gapHtml(s.sentence)}</p>` : ''}`);
      setDock(`<div class="options">${order.map((k, n) => `<button class="opt" type="button" data-k="${k}"><span class="key">${'ABCDEF'[n]}</span><span>${esc(s.options[k])}</span></button>`).join('')}</div>${askLink()}`, d => {
        $$('.opt', d).forEach(b => b.onclick = () => {
          const k = +b.dataset.k, ok = k === s.answer, right = s.options[s.answer];
          meSay(esc(s.options[k]));
          const full = s.sentence.includes('___') ? `<p class="en">${esc(s.sentence).replace('___', `<b class="fill">${esc(right)}</b>`)}</p>` : '';
          const why = s.why ? `<p>${fmt(s.why)}</p>` : '';
          record(ok, ok ? null : { q: s.sentence || s.q, yours: s.sentence.includes('___') ? s.sentence.replace('___', s.options[k]) : s.options[k], right: s.sentence.includes('___') ? s.sentence.replace('___', right) : right, why: s.why });
          feedback(ok ? 'ok' : 'bad', ok ? full + why : `<p>Doğru cevap: <b>${esc(right)}</b></p>${full}${why}`);
          continueDock();
        });
      });
    },
    fill(s) {
      miaSay(`<p class="tag">Boşluk doldurma</p><p>${fmt(s.q)}</p><p class="en big">${gapHtml(s.sentence)}</p>${s.hint ? `<p class="hint">İpucu: ${esc(s.hint)}</p>` : ''}`);
      setDock(`<form class="compose" data-f><input class="field" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Boşluğa gelecek kelime(ler)" aria-label="Cevabın"><button class="btn primary">Kontrol et</button></form>${askLink()}`, d => {
        const inp = $('input', d);
        if (fine()) inp.focus({ preventScroll: true });
        $('[data-f]', d).onsubmit = e => {
          e.preventDefault();
          const v = inp.value.trim();
          if (!v) return inp.focus();
          meSay(`<span class="en">${esc(s.sentence).replace('___', `<b>${esc(v)}</b>`)}</span>`);
          const ok = s.answers.some(a => norm(a) === norm(v)), right = s.answers[0];
          const why = s.why ? `<p>${fmt(s.why)}</p>` : '';
          const ref = record(ok, ok ? null : { q: s.sentence, yours: s.sentence.replace('___', v), right: s.sentence.replace('___', right), why: s.why });
          if (ok) { feedback('ok', why); return continueDock(); }
          feedback('bad', `<p>Beklenen cevap: <b>${esc(right)}</b></p><p class="en">${esc(s.sentence).replace('___', `<b class="fill">${esc(right)}</b>`)}</p>${why}`);
          continueDock(appealBtn, dd => { $('[data-x=appeal]', dd).onclick = () => appeal('fill', s, v, ref); });
        };
      });
    },
    order(s) {
      let words = s.answer.split(/\s+/).map(w => w.replace(/^[^\w']+|[^\w']+$/g, '')).filter(Boolean);
      if (words.length && words[0] !== 'I' && !/^I'/.test(words[0])) words[0] = words[0].charAt(0).toLowerCase() + words[0].slice(1);
      const start = words.map((w, k) => ({ w, k }));
      let bank = shuffle(start), built = [];
      for (let tries = 0; tries < 6 && bank.every((c, n) => c.k === n) && bank.length > 1; tries++) bank = shuffle(start);
      miaSay(`<p class="tag">Cümle kurma</p><p>${fmt(s.q)}</p>${s.tr ? `<p class="hint">Anlamı: ${esc(s.tr)}</p>` : ''}`);
      const draw = () => `<div class="built" aria-live="polite">${built.length ? built.map((c, n) => `<button class="chip-w on" type="button" data-b="${n}">${esc(c.w)}</button>`).join('') : '<span class="ph">Kelimelere sırayla dokun</span>'}</div>
        <div class="bank">${bank.map((c, n) => `<button class="chip-w" type="button" data-n="${n}">${esc(c.w)}</button>`).join('')}</div>
        <div class="dock-row"><button class="btn ghost" type="button" data-x="clear" ${built.length ? '' : 'disabled'}>Temizle</button><button class="btn primary grow" type="button" data-x="check" ${bank.length ? 'disabled' : ''}>Kontrol et</button></div>${askLink()}`;
      const rerender = () => renderDock();
      setDock(draw, d => {
        $$('[data-n]', d).forEach(b => b.onclick = () => { built.push(bank.splice(+b.dataset.n, 1)[0]); rerender(); });
        $$('[data-b]', d).forEach(b => b.onclick = () => { bank.push(built.splice(+b.dataset.b, 1)[0]); rerender(); });
        $('[data-x=clear]', d).onclick = () => { bank = bank.concat(built); built = []; rerender(); };
        $('[data-x=check]', d).onclick = () => {
          const sent = capFirst(built.map(c => c.w).join(' '));
          meSay(`<span class="en">${esc(sent)}</span>`);
          const ok = [s.answer, ...s.alts].some(a => norm(a) === norm(sent));
          const ref = record(ok, ok ? null : { q: s.tr || 'Cümle kurma', yours: sent, right: s.answer, why: '' });
          if (ok) { feedback('ok', `<p class="en">${esc(s.answer)}</p>`); return continueDock(); }
          feedback('bad', `<p>Doğru sıralama:</p><p class="en big">${esc(s.answer)}</p>`);
          continueDock(appealBtn, dd => { $('[data-x=appeal]', dd).onclick = () => appeal('order', s, sent, ref); });
        };
      });
    },
    match(s) {
      const left = shuffle(s.pairs.map((p, k) => ({ k, t: p.en }))), right = shuffle(s.pairs.map((p, k) => ({ k, t: p.tr })));
      let sel = null, errors = 0;
      const done = new Set();
      const el = miaSay(`<p class="tag">Eşleştirme</p><p>${fmt(s.q)}</p><div class="match">
        <div class="mcol">${left.map(x => `<button class="mbtn" type="button" data-side="l" data-k="${x.k}">${esc(x.t)}</button>`).join('')}</div>
        <div class="mcol">${right.map(x => `<button class="mbtn" type="button" data-side="r" data-k="${x.k}">${esc(x.t)}</button>`).join('')}</div></div>`);
      setDock(`<p class="dock-note">Soldan bir ifade, sağdan anlamını seç.</p>${askLink()}`);
      $$('.mbtn', el).forEach(b => b.onclick = () => {
        if (done.has(b.dataset.k + b.dataset.side)) return;
        if (!sel || sel.dataset.side === b.dataset.side) { if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); return; }
        const a = sel; sel = null;
        if (a.dataset.k === b.dataset.k) {
          [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); x.disabled = true; done.add(x.dataset.k + x.dataset.side); });
          if (done.size === s.pairs.length * 2) {
            record(errors === 0, null);
            feedback('ok', `<p>${errors ? `Hepsini eşleştirdin. ${errors} kez yanlış eşleştirme yaptın, sorun değil.` : 'Hepsini ilk denemede eşleştirdin.'}</p>`, errors ? 'Tamamladın!' : 'Mükemmel!');
            continueDock();
          }
        } else {
          errors++;
          [a, b].forEach(x => x.classList.add('wrong'));
          setTimeout(() => [a, b].forEach(x => x.classList.remove('wrong', 'sel')), 600);
        }
      });
    },
    translate(s) {
      miaSay(`<p class="tag">Çeviri</p><p>${fmt(s.q)}</p><p class="tr-big">${esc(s.tr)}</p>`);
      textDock('İngilizcesini yaz…', v => {
        meSay(`<span class="en">${esc(v)}</span>`);
        if ([s.answer, ...s.alts].some(a => norm(a) === norm(v))) { record(true, null); feedback('ok', ''); return continueDock(); }
        aiCheck('translate', s, v);
      });
    },
    write(s) {
      miaSay(`<p class="tag">Kendi cümlen</p><p>${fmt(s.q)}</p>`);
      textDock('Cümleni İngilizce yaz…', v => { meSay(`<span class="en">${esc(v)}</span>`); aiCheck('write', s, v); });
    },
    dialogue(s) {
      miaSay(`<p class="tag">Sohbet pratiği</p>${s.scene ? `<p>${fmt(s.scene)}</p>` : ''}${s.goal ? `<p class="hint">Hedef: ${fmt(s.goal)}</p>` : ''}<p class="hint">Kısa cevaplar yeterli. Hata yaparsan kırmızı kalemle düzeltirim. Kelimeye takılırsan Türkçe yazabilirsin.</p>`);
      L.chat = {
        rules: chatRules({ role: s.role, scene: s.scene, goal: s.goal, level: L.lesson.level, focus: L.lesson.f }),
        turns: [{ role: 'assistant', content: JSON.stringify({ fixed: null, note: '', reply: s.opening, reply_tr: s.opening_tr }) }],
        n: 0, inLesson: true
      };
      miaLine(s.opening, s.opening_tr);
      dialogueDock();
    }
  };
  function dialogueDock() {
    const n = L.chat.n;
    textDock(n ? 'Cevabını yaz…' : 'Mia\'ya cevap ver…', v => chatSend(L.chat, v, dialogueDock), {
      ask: false,
      extra: n >= 2 ? `<button class="btn ghost grow" type="button" data-x="end">${n >= 4 ? 'Sohbeti bitir ve dersi tamamla' : 'Sohbeti bitir'}</button>` : '',
      wire: d => { const b = $('[data-x=end]', d); if (b) b.onclick = next; }
    });
  }

  function gradePrompt(kind, s, v) {
    const l = L.lesson;
    const task = {
      translate: `The learner translated this Turkish sentence into English: "${s.tr}"\nReference translation: "${s.answer}"`,
      write: `Task given to the learner (in Turkish): "${s.q}"\nA good answer: ${s.check || 'uses this lesson\'s focus correctly'}`,
      fill: `Gap-fill sentence: "${s.sentence}"\nExpected answer(s) for the gap: ${(s.answers || []).map(a => `"${a}"`).join(', ')}\nThe learner's answer below is only what they wrote in the gap. Decide whether it is also correct and natural there.`,
      order: `The learner had to put given words in order to make a sentence meaning (in Turkish) "${s.tr}". Expected sentence: "${s.answer}". Decide whether the learner's word order is also correct and natural.`
    }[kind];
    return `You are Mia, a warm English teacher for Turkish speakers. Learner level: ${l.level} (CEFR). Lesson: "${l.t}". Focus: ${l.f}

${task}
Learner's answer: """${v}"""

Judge the answer. Accept any natural, grammatical answer that does the task, even if it differs from the reference. Do not count a missing final full stop or a lowercase first letter as a mistake.
Reply with only this JSON:
{"verdict":"correct" or "almost" or "wrong","corrected":"the learner's answer with the fewest changes needed to make it correct (identical if it is already correct)","feedback":"1–2 short, friendly sentences in Turkish: what is good and, if there is a mistake, what it is and why. Wrap English words in **double asterisks**.","better":"a more natural English version if there is a clearly better one, otherwise an empty string"}
Use "almost" only for one small slip (spelling, an article, one missing small word). If the answer is in Turkish or does not do the task, use "wrong" and put a correct English answer in "corrected".`;
  }
  async function aiCheck(kind, s, v) {
    const R = L;
    setDock('<p class="dock-note">Mia kontrol ediyor…</p>');
    showTyping();
    try {
      const r = await AI.json(gradePrompt(kind, s, v), { tier: tier() });
      if (R !== L) return;
      hideTyping();
      const verdict = ['correct', 'almost', 'wrong'].includes(r && r.verdict) ? r.verdict : 'wrong';
      let corrected = str(r && r.corrected, 400) || (kind === 'translate' ? s.answer : v);
      if (verdict === 'correct') corrected = v;
      const fb = str(r && r.feedback, 600), better = str(r && r.better, 400);
      record(verdict !== 'wrong', verdict === 'correct' ? null : { q: kind === 'translate' ? s.tr : s.q, yours: v, right: corrected, why: fb });
      const diff = verdict === 'correct' ? '' : `<p class="redpen en">${diffHtml(v, corrected)}</p>`;
      const showBetter = better && norm(better) !== norm(corrected) && norm(better) !== norm(v);
      const ex = kind === 'write' && s.example && verdict === 'wrong' ? `<p class="hint">Örnek cevap: <span class="en">${esc(s.example)}</span></p>` : '';
      feedback(verdict === 'correct' ? 'ok' : verdict === 'almost' ? 'almost' : 'bad', `${diff}${fb ? `<p>${fmt(fb)}</p>` : ''}${showBetter ? `<p class="better"><span class="lbl">Daha doğal:</span> <span class="en">${esc(better)}</span></p>` : ''}${ex}`, verdict === 'almost' ? 'Neredeyse!' : null);
      continueDock();
    } catch (e) {
      if (R !== L) return;
      hideTyping();
      if (e && e.code === 'cancelled') return;
      const model = kind === 'translate' ? s.answer : s.example;
      miaSay(`<p>${esc(errText(e && e.code))}</p>${model ? `<p>Kendi cevabını şununla karşılaştırabilirsin:</p><p class="en big">${esc(model)}</p>` : ''}`, 'note');
      continueDock('<button class="btn ghost" type="button" data-x="retry">Tekrar dene</button>', d => { $('[data-x=retry]', d).onclick = () => aiCheck(kind, s, v); });
    }
  }
  async function appeal(kind, s, v, ref) {
    const R = L;
    setDock('<p class="dock-note">Mia cevabını tekrar inceliyor…</p>');
    showTyping();
    try {
      const r = await AI.json(gradePrompt(kind, s, v), { tier: tier() });
      if (R !== L) return;
      hideTyping();
      if (r && (r.verdict === 'correct' || r.verdict === 'almost')) {
        R.correct++;
        R.newMistakes = R.newMistakes.filter(m => m !== ref);
        feedback('ok', `<p>${fmt(str(r.feedback, 600) || 'Bu cevap da doğru.')}</p>`, 'Haklısın!');
      } else feedback('bad', `<p>${fmt(str(r && r.feedback, 600) || 'Bu cevap bu cümlede uygun değil.')}</p>`, 'Maalesef olmadı');
    } catch (e) {
      if (R !== L) return;
      hideTyping();
      if (!(e && e.code === 'cancelled')) miaSay(`<p>${esc(errText(e && e.code))}</p>`, 'note');
    }
    continueDock();
  }

  function askMode() {
    if (!L) return;
    const R = L, prev = R.dock;
    setDock(`<form class="ask" data-f><textarea class="field" rows="2" placeholder="Sorunu Türkçe yaz. Örnek: Burada neden is kullandık?" aria-label="Mia'ya sorun"></textarea><div class="dock-row"><button type="button" class="btn ghost" data-x="cancel">Derse dön</button><button class="btn primary grow">Sor</button></div></form>`, d => {
      const f = $('[data-f]', d), ta = $('textarea', d);
      autoGrow(ta); enterSubmits(ta, f); ta.focus({ preventScroll: true });
      $('[data-x=cancel]', d).onclick = () => { R.dock = prev; renderDock(); };
      f.onsubmit = async e => {
        e.preventDefault();
        const q = ta.value.trim();
        if (!q) return ta.focus();
        meSay(esc(q));
        const bubble = miaSay('<span class="dots" aria-label="Mia yazıyor"><i></i><i></i><i></i></span>');
        const body = $('.bubble', bubble);
        setDock('<p class="dock-note">Mia cevaplıyor…</p>');
        const st = R.steps[R.pos] || {};
        const prompt = `You are Mia, a warm English teacher for Turkish speakers. The learner (level ${R.lesson.level}) is doing the lesson "${R.lesson.t}" (focus: ${R.lesson.f}).
They are looking at this part of the lesson (JSON): ${JSON.stringify(st).slice(0, 2500)}
Their question, in Turkish: """${q}"""
Answer in simple, friendly Turkish in at most 120 words. Give a short English example if it helps. Wrap English words and sentences in **double asterisks**. Plain text only: no headings, no tables.`;
        try { await AI.text(prompt, { tier: tier(), onText: ({ text }) => { body.innerHTML = `<p>${fmt(text)}</p>`; scrollDown(); } }); }
        catch (err) { if (!(err && err.code === 'cancelled')) body.innerHTML = `<p>${esc(errText(err && err.code))}</p>`; }
        if (R !== L) return;
        R.dock = prev;
        renderDock();
      };
    });
  }

  async function generateLesson(R, fresh) {
    const l = R.lesson;
    if (!AI.ready()) return lessonError(R, 'no_key');
    miaSay(`<p>Bu dersi senin için hazırlıyorum. Birkaç saniye ile bir dakika arası sürebilir; yazdıkça göstereceğim, sen okumaya başlarsın.</p>${AI.provider() === 'claude' && !Object.keys(S.docs).length ? '<p class="hint">İlk seferde Claude hesabını kullanmam için izin isteyen bir pencere çıkabilir.</p>' : ''}`, 'note');
    showTyping();
    setDock('<p class="dock-note">Mia dersi hazırlıyor…</p>');
    R.streaming = true;
    let buf = '';
    const eat = line => {
      line = line.trim();
      if (!line || line.startsWith('```')) return;
      try { ingest(R, JSON.parse(line)); } catch (e) { return; }
      if (!R.started && R.steps.length) begin(R, false);
    };
    try {
      const opts = { tier: 'default', fresh, onText: ({ delta }) => { const parts = (buf + delta).split('\n'); buf = parts.pop(); parts.forEach(eat); } };
      const res = await AI.text(lessonPrompt(l), opts);
      eat(buf); buf = '';
      R.streaming = false;
      if (!res.truncated && lessonSteps(R) >= 6) saveDoc(l.id, R.raw);
      if (R !== L) return;
      if (!R.started) return lessonError(R, 'empty_completion');
      if (R.waiting) { R.waiting = false; hideTyping(); goStep(R.pos); }
    } catch (e) {
      eat(buf); buf = '';
      R.streaming = false;
      R.failed = (e && e.code) || 'upstream_error';
      if (R !== L || R.failed === 'cancelled') return;
      if (!R.started) return lessonError(R, R.failed);
      if (R.waiting) {
        R.waiting = false;
        hideTyping();
        miaSay(`<p>Dersin geri kalanını yazarken bir sorun oldu. ${esc(errText(R.failed))}</p>`, 'note');
        setDock('<div class="dock-row"><button class="btn ghost" type="button" data-x="end">Dersi burada bitir</button><button class="btn primary grow" type="button" data-x="again">Dersi yeniden hazırla</button></div>', d => {
          $('[data-x=end]', d).onclick = finishLesson;
          $('[data-x=again]', d).onclick = () => openLesson(l.id, { fresh: true });
        });
      }
    }
  }
  function lessonError(R, code) {
    if (R !== L) return;
    hideTyping();
    miaSay(`<p>${esc(errText(code))}</p>`, 'note');
    const perm = code === 'not_granted' && P.perms;
    setDock(`<div class="dock-row"><button class="btn ghost" type="button" data-act="home">Derslere dön</button>${perm ? '<button class="btn ghost" type="button" data-x="perms">İzinleri yönet</button>' : ''}${code === 'no_key' || code === 'bad_key' ? '<button class="btn primary grow" type="button" data-act="settings">Ayarları aç</button>' : '<button class="btn primary grow" type="button" data-x="again">Tekrar dene</button>'}</div>`, d => {
      const a = $('[data-x=again]', d); if (a) a.onclick = () => openLesson(R.lesson.id);
      const p = $('[data-x=perms]', d); if (p) p.onclick = managePerms;
    });
  }
  const prefetching = {};
  // Ders bitince sıradakini arka planda hazırlar; o ders açılırsa bu hazırlık beklenir, ikinci istek gitmez.
  function prefetch(l) {
    if (!AI.ready() || !l || S.docs[l.id] || prefetching[l.id] || l.id === D.starter.id) return;
    prefetching[l.id] = (async () => {
      try {
        const doc = await Store.load('lesson-' + l.id);
        if (doc && Array.isArray(doc.lines) && doc.lines.length) { S.docs[l.id] = doc; return; }
        const res = await AI.text(lessonPrompt(l), { tier: 'default' });
        const R = newRun(l);
        parseLines(res.text, R);
        if (!res.truncated && lessonSteps(R) >= 6 && !S.docs[l.id]) saveDoc(l.id, R.raw);
      } catch (e) { /* önceden hazırlık olmazsa ders açılınca hazırlanır */ }
      finally { delete prefetching[l.id]; }
    })();
  }

  function finishLesson() {
    const R = L;
    if (!R || R.finished) return;
    R.finished = true;
    hideTyping();
    setResume(null);
    progress();
    const pct = R.graded ? R.correct / R.graded : 1;
    R.stars = pct >= 0.9 ? 3 : pct >= 0.65 ? 2 : 1;
    const words = (R.vocab && R.vocab.words) || [];
    if (words.length) miaCard(`<article class="card words"><p class="tag">Yeni kelimeler</p><h3>Bu dersin kelimeleri</h3><ul class="vlist">${words.map(w => `<li data-en="${esc(w.ex || w.en)}"><b class="en">${esc(w.en)}</b><span>${esc(w.tr)}</span>${w.ex ? `<i class="en">${wordify(w.ex)}</i>` : ''}</li>`).join('')}</ul><p class="hint">Dersi bitirince bu kelimeler defterine eklenir.</p></article>`);
    const pts = (R.summary && R.summary.points) || [];
    miaCard(`<article class="card summary"><p class="tag">Özet</p><h3>Bu derste öğrendiklerin</h3>${pts.length ? `<ul>${pts.map(p => `<li>${fmt(p)}</li>`).join('')}</ul>` : `<p>${esc(R.lesson.g)}</p>`}<div class="score">${starsHtml(R.stars)}<span>${R.graded ? `${R.correct} / ${R.graded} alıştırma doğru` : ''}</span></div></article>`);
    setDock('<div class="dock-row"><button class="btn primary grow" type="button" data-x="finish">Dersi bitir</button></div>', d => { $('[data-x=finish]', d).onclick = completeLesson; });
  }
  function completeLesson() {
    const R = L, id = R.lesson.id;
    if (!S.profile) S.profile = newProfile(R.lesson.level);
    const p = S.profile, prev = p.done[id];
    p.done[id] = { stars: Math.max(R.stars, (prev && prev.stars) || 0), at: today() };
    const t = today(), st = p.streak || (p.streak = { n: 0, last: null });
    if (st.last !== t) { st.n = st.last === addDays(t, -1) ? st.n + 1 : 1; st.last = t; }
    let added = 0;
    ((R.vocab && R.vocab.words) || []).forEach(w => { if (addWord(w, id)) added++; });
    Store.save('profile', p);
    if (added) Store.save('vocab', S.vocab);
    addMistakes(R.newMistakes);
    R.newMistakes = [];
    const nx = nextLesson();
    miaSay(`<p><b>Tebrikler, dersi bitirdin!</b> ${st.n > 1 ? `${st.n} gündür üst üste çalışıyorsun.` : 'Serin başladı. Yarın da bir ders yaparsan devam eder.'}</p>${added ? `<p>${added} yeni kelime defterine eklendi.</p>` : ''}${R.failed ? '<p class="hint">Bu dersin bir kısmı yarıda kaldığı için kaydedilmedi; bir dahaki açışında yeniden hazırlanır.</p>' : ''}`, 'ok');
    setDock(`<div class="dock-row"><button class="btn ghost" type="button" data-act="home">Ana sayfa</button>${nx ? `<button class="btn primary grow" type="button" data-x="nx">Sonraki ders: ${esc(nx.t)}</button>` : ''}</div>`, d => {
      const b = $('[data-x=nx]', d); if (b) b.onclick = () => openLesson(nx.id);
    });
    if (nx) prefetch(nx);
  }

  function lessonMenu(anchor) {
    if (!L) return;
    const id = L.lesson.id;
    openPop(anchor, `<button class="menu-item" type="button" data-m="restart">Dersi baştan başlat<small>Aynı içerikle en başa döner.</small></button>
      <button class="menu-item" type="button" data-m="fresh">Dersi yeniden hazırla<small>Mia bu ders için yeni açıklama ve alıştırmalar yazar.</small></button>`, pop => {
      $('[data-m=restart]', pop).onclick = () => { hidePop(); setResume(null); openLesson(id); };
      $('[data-m=fresh]', pop).onclick = () => {
        hidePop();
        if (!AI.ready()) return toast(errText('no_key'));
        delete S.docs[id]; Store.remove('lesson-' + id); setResume(null);
        openLesson(id, { fresh: true });
      };
    });
  }

  // ---------- Sohbet ----------
  function chatRules(o) {
    return `You are Mia, a friendly English tutor chatting by text with a Turkish learner whose level is ${o.level} (CEFR).
Role-play. ${o.scene ? `Situation (in Turkish): ${o.scene} ` : ''}You play: ${o.role}.${o.goal ? `\nThe learner's goal (in Turkish): ${o.goal}` : ''}${o.focus ? `\nThe learner has just studied: ${o.focus}\nGently create chances to use it.` : ''}
For every learner message:
1. Check their English. If there is a real mistake (grammar, word choice, word order or spelling), write a minimally corrected version in "fixed". Do not correct only a missing final full stop or a lowercase first letter. If there is no real mistake, "fixed" is null. If they write in Turkish, put a natural English way to say it in "fixed".
2. Stay in character and continue the conversation: 1–2 short sentences of natural English at ${o.level} level, usually ending with a question.
Reply with only this JSON:
{"fixed": string or null, "note": "if fixed: one short Turkish sentence explaining the main correction, wrapping English words in **double asterisks**; otherwise an empty string", "reply": "your English reply", "reply_tr": "the Turkish translation of your reply"}`;
  }
  async function chatSend(chat, text, after) {
    meSay(`<span class="en">${esc(text)}</span>`);
    setDock('<p class="dock-note">Mia yazıyor…</p>');
    showTyping();
    const owner = chat.inLesson ? L : S.chat;
    const alive = () => (chat.inLesson ? L === owner && L.chat === chat : S.chat === chat && S.tab === 'chat');
    try {
      const r = await AI.json([{ role: 'user', content: chat.rules }, ...chat.turns.slice(-16), { role: 'user', content: text }], { tier: tier(), fresh: true });
      const reply = str(r && r.reply, 800);
      if (!reply) throw { code: 'empty_completion' };
      chat.turns.push({ role: 'user', content: text }, { role: 'assistant', content: JSON.stringify(r) });
      chat.n++;
      if (!alive()) return;
      hideTyping();
      const fixed = str(r.fixed, 800);
      if (fixed && norm(fixed) !== norm(text)) {
        const note = str(r.note, 400);
        miaSay(`<p class="redpen en">${diffHtml(text, fixed)}</p>${note ? `<p>${fmt(note)}</p>` : ''}`, 'fix');
        const m = { q: chat.inLesson ? 'Sohbet · ' + L.lesson.t : 'Sohbet · ' + S.chat.topic.t, yours: text, right: fixed, why: note, at: today(), l: chat.inLesson ? L.lesson.id : '' };
        if (chat.inLesson) L.newMistakes.push(m); else addMistakes([m]);
      }
      miaLine(reply, str(r.reply_tr, 800));
      if (chat.inLesson && chat.n === 4) miaSay('<p>Çok iyi gidiyorsun! İstersen devam et, istersen sohbeti bitirip dersi tamamla.</p>', 'note');
    } catch (e) {
      if (!alive()) return;
      hideTyping();
      if (!(e && e.code === 'cancelled')) miaSay(`<p>${esc(errText(e && e.code))}</p>`, 'note');
    }
    after();
  }
  function renderChat() {
    S.tab = 'chat';
    if (!S.chat) {
      THREAD = null;
      setChrome({ top: topMain('Sohbet'), nav: true });
      const m = main(); m.className = 'main';
      m.innerHTML = `<div class="wrap chat-home">
        <h1>Mia ile yazış</h1>
        <p class="lead">Bir konu seç, Mia o rolde seninle yazışsın. Hatalarını kırmızı kalemle düzeltir; cevaplarının Türkçesini de görebilirsin. Seviyen: ${chatLevel()}.</p>
        ${AI.ready() || S.loading ? '' : setupCard()}
        <div class="topics">${D.topics.map(t => `<button class="topic" type="button" data-topic="${t.id}"><b>${esc(t.t)}</b><span>${esc(t.d)}</span></button>`).join('')}</div>
      </div>`;
      $$('[data-topic]', m).forEach(b => b.onclick = () => startChat(b.dataset.topic));
      return;
    }
    setChrome({ top: topBack(S.chat.topic.t, 'Sohbet', 'chat-exit'), nav: false, dock: true });
    const m = main(); m.className = 'main';
    m.innerHTML = '';
    m.appendChild(S.chat.wrap);
    THREAD = $('.thread', S.chat.wrap);
    chatDock();
    scrollDown();
  }
  function chatDock() { textDock('İngilizce yaz (takılırsan Türkçe de olur)…', v => chatSend(S.chat, v, chatDock), { ask: false }); }
  function startChat(id) {
    const topic = D.topics.find(t => t.id === id);
    S.chat = {
      topic, wrap: h('<div class="wrap thread-wrap"><div class="thread"></div></div>'),
      rules: chatRules({ role: topic.role, level: chatLevel() }),
      turns: [{ role: 'assistant', content: JSON.stringify({ fixed: null, note: '', reply: topic.open, reply_tr: topic.open_tr }) }],
      n: 0, inLesson: false
    };
    L = null;
    renderChat();
    miaLine(topic.open, topic.open_tr);
  }

  // ---------- Defter ----------
  function renderNotes() {
    S.tab = 'notes';
    THREAD = null;
    setChrome({ top: topMain('Defterim'), nav: true });
    const m = main(); m.className = 'main';
    const words = Object.values(S.vocab.words).sort((a, b) => String(b.added || '').localeCompare(String(a.added || '')) || a.en.localeCompare(b.en));
    const due = dueWords();
    const items = S.mistakes.items;
    const tab = S.notesTab;
    m.innerHTML = `<div class="wrap notes">
      <div class="seg" role="tablist" aria-label="Defter bölümleri">
        <button type="button" role="tab" data-sub="words" aria-selected="${tab === 'words'}">Kelimeler<i>${words.length}</i></button>
        <button type="button" role="tab" data-sub="mistakes" aria-selected="${tab === 'mistakes'}">Hatalarım<i>${items.length}</i></button>
      </div>
      ${tab === 'words' ? (words.length ? `
        <div class="review-cta">${due.length ? `<p><b>${due.length}</b> kelimenin tekrar zamanı geldi.</p><button class="btn primary" type="button" data-act="review">Tekrar et</button>` : '<p>Bugünkü tekrarın bitti.</p><button class="btn ghost" type="button" data-act="review-all">Yine de tekrar et</button>'}</div>
        <ul class="wordlist">${words.map(w => `<li><b class="en">${esc(w.en)}</b><span>${esc(w.tr)}</span><span class="level-dots" title="Öğrenme düzeyi ${w.box || 0}/5">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= (w.box || 0) ? 'on' : ''}"></i>`).join('')}</span></li>`).join('')}</ul>`
        : '<div class="empty"><h2>Henüz kelime yok</h2><p>Dersleri bitirdikçe yeni kelimeler buraya eklenir. Derslerde bir İngilizce kelimeye dokunup "Defterime ekle" diyerek de ekleyebilirsin.</p></div>')
      : (items.length ? `
        <ul class="mistakes">${items.map(it => `<li>${it.q ? `<p class="q">${esc(it.q)}</p>` : ''}<p class="redpen en">${diffHtml(it.yours, it.right)}</p>${it.why ? `<p class="why">${fmt(it.why)}</p>` : ''}</li>`).join('')}</ul>
        <div id="clear-area"><button class="btn ghost danger wide" type="button" data-x="clear">Listeyi temizle</button></div>`
        : '<div class="empty"><h2>Hata yok</h2><p>Alıştırmalarda ve sohbetlerde yaptığın hatalar, doğrusu ve açıklamasıyla burada birikir. Tekrar okumak hatırlamanı kolaylaştırır.</p></div>')}
    </div>`;
    $$('[data-sub]', m).forEach(b => b.onclick = () => { S.notesTab = b.dataset.sub; renderNotes(); });
    const c = $('[data-x=clear]', m);
    if (c) c.onclick = () => {
      const area = $('#clear-area', m);
      area.innerHTML = '<p class="hint">Bütün hata kayıtların silinecek. Emin misin?</p><div class="dock-row"><button class="btn ghost" type="button" data-x="no">Vazgeç</button><button class="btn primary grow" type="button" data-x="yes">Evet, temizle</button></div>';
      $('[data-x=no]', area).onclick = renderNotes;
      $('[data-x=yes]', area).onclick = () => { S.mistakes = { items: [] }; Store.save('mistakes', S.mistakes); renderNotes(); };
    };
  }
  const INTERVAL = [0, 1, 3, 7, 14, 30];
  function startReview(all) {
    const pool = all ? shuffle(Object.values(S.vocab.words)).slice(0, 12) : dueWords().sort((a, b) => (a.box || 0) - (b.box || 0)).slice(0, 20);
    if (!pool.length) return renderNotes();
    S.tab = 'review';
    THREAD = null;
    const q = pool.slice(), again = new Set();
    let i = 0, shown = false, known = 0, sinceSave = 0;
    setChrome({ top: topBack('Kelime tekrarı', 'Defterim', 'notes'), nav: false, dock: true });
    const m = main(); m.className = 'main';
    const save = () => { Store.save('vocab', S.vocab); sinceSave = 0; };
    const draw = () => {
      if (i >= q.length) {
        save();
        m.innerHTML = `<div class="wrap review"><div class="flash"><div class="front">Tekrar bitti!</div><p class="ex">${known} kelimeyi bildin. Bilmediklerin yakında yeniden karşına çıkacak.</p></div></div>`;
        renderDock({ html: '<div class="dock-row"><button class="btn primary grow" type="button" data-act="notes">Defterime dön</button></div>' });
        return;
      }
      const w = q[i];
      m.innerHTML = `<div class="wrap review"><p class="review-meta">${i + 1} / ${q.length}</p><div class="flash" data-en="${esc(w.ex || w.en)}"><div class="front en">${esc(w.en)}</div>${w.ex ? `<p class="ex en">${wordify(w.ex)}</p>` : ''}${shown ? `<div class="back">${esc(w.tr)}</div>` : ''}</div></div>`;
      renderDock({
        html: shown ? '<div class="dock-row"><button class="btn ghost grow" type="button" data-x="no">Bilmiyordum</button><button class="btn primary grow" type="button" data-x="yes">Biliyordum</button></div>'
          : '<div class="dock-row"><button class="btn primary grow" type="button" data-x="show">Anlamını göster</button></div>',
        wire: d => {
          const s = $('[data-x=show]', d); if (s) s.onclick = () => { shown = true; draw(); };
          const y = $('[data-x=yes]', d); if (y) y.onclick = () => { w.box = Math.min(5, (w.box || 0) + 1); w.due = addDays(today(), INTERVAL[w.box]); known++; step(); };
          const n = $('[data-x=no]', d); if (n) n.onclick = () => { w.box = 0; w.due = today(); if (!again.has(w.en)) { again.add(w.en); q.push(w); } step(); };
        }
      });
    };
    const step = () => { i++; shown = false; if (++sinceSave >= 5) save(); draw(); };
    draw();
  }

  // ---------- Kelimeye dokununca ----------
  let popToken = null;
  function openPop(anchor, html, wire) {
    const pop = $('#pop');
    pop.innerHTML = html;
    pop.hidden = false;
    placePop(anchor);
    if (wire) wire(pop);
  }
  function placePop(anchor) {
    const pop = $('#pop');
    if (pop.hidden || !anchor || !anchor.isConnected) return;
    const r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8);
    let top = r.bottom + 8;
    if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 8);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }
  function hidePop() { const pop = $('#pop'); if (pop) { pop.hidden = true; pop.innerHTML = ''; } popToken = null; }
  async function showWord(el) {
    const word = el.textContent;
    const ctx = (el.closest('[data-en]') && el.closest('[data-en]').dataset.en) || el.parentElement.textContent;
    const sentence = (ctx.match(/[^.!?]+[.!?]*/g) || [ctx]).find(x => x.includes(word)) || ctx;
    const token = popToken = {};
    openPop(el, `<div class="pop-head"><b class="en">${esc(word)}</b><button class="icon-btn sm" type="button" data-x="close" aria-label="Kapat">${ICON.x}</button></div><p class="pop-tr hint">Bakıyorum…</p>`, wireClose);
    if (!AI.ready()) { $('.pop-tr', $('#pop')).textContent = errText('no_key'); return; }
    try {
      const r = await AI.json(`A Turkish learner of English tapped the word "${word}" in this English text: "${ctx.slice(0, 700)}"
Reply with only this JSON: {"base":"the dictionary form of the word","tr":"its Turkish meaning in this context, 1–4 words","note":"a very short Turkish note if useful (for example 'go fiilinin geçmiş hâli'), otherwise an empty string"}`, { tier: 'quick', cacheKey: word + '|' + ctx.slice(0, 300) });
      if (popToken !== token) return;
      const base = str(r && r.base, 60) || word, tr = str(r && r.tr, 120), note = str(r && r.note, 200);
      const key = base.toLowerCase(), has = !!S.vocab.words[key];
      openPop(el, `<div class="pop-head"><b class="en">${esc(base)}</b><button class="icon-btn sm" type="button" data-x="close" aria-label="Kapat">${ICON.x}</button></div>
        <p class="pop-tr">${esc(tr || '—')}</p>${note ? `<p class="hint">${esc(note)}</p>` : ''}
        <button class="btn ghost" type="button" data-x="add" ${has ? 'disabled' : ''}>${has ? 'Defterinde var' : 'Defterime ekle'}</button>`, pop => {
        wireClose(pop);
        $('[data-x=add]', pop).onclick = e => {
          if (addWord({ en: base, tr, ex: sentence.trim() }, L ? L.lesson.id : '')) { Store.save('vocab', S.vocab); toast('Defterine eklendi.'); }
          e.currentTarget.disabled = true; e.currentTarget.textContent = 'Defterinde var';
        };
      });
    } catch (err) {
      if (popToken !== token) return;
      const t = $('.pop-tr', $('#pop')); if (t) t.textContent = errText(err && err.code);
    }
  }
  function wireClose(pop) { const c = $('[data-x=close]', pop); if (c) c.onclick = hidePop; }

  // ---------- Ayarlar ----------
  async function managePerms() {
    if (!P.perms) return toast('İzinleri sayfanın üstündeki menüden yönetebilirsin.');
    try { await P.perms.manage(); } catch (e) { toast('İzin panelini açamadım. Sayfanın üstündeki izin menüsünü kullanabilirsin.'); }
  }
  function openSettings() {
    const el = $('#sheet'), p = S.profile;
    el.hidden = false;
    el.innerHTML = `<div class="sheet-back" data-x="close"></div>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="st-title">
        <div class="sheet-head"><h2 id="st-title">Ayarlar</h2><button class="icon-btn" type="button" data-x="close" aria-label="Kapat">${ICON.x}</button></div>
        <section><h3>Mia'nın cevap hızı</h3>
          <div class="seg"><button type="button" data-tier="quick" aria-pressed="${tier() === 'quick'}">Hızlı</button><button type="button" data-tier="careful" aria-pressed="${tier() !== 'quick'}">Dikkatli</button></div>
          <p class="hint">Hızlı: cevapların birkaç saniyede kontrol edilir. Dikkatli: daha ayrıntılı düşünür ama her cevap 10–40 saniye sürebilir. Dersler her iki ayarda da dikkatli hazırlanır.</p></section>
        <section><h3>Başlangıç seviyen</h3><p>${p ? `${p.level} · ${esc(LEVEL[p.level].name)}` : 'Henüz seçilmedi'}</p>
          <div class="dock-row"><button class="btn ghost grow" type="button" data-x="level">Seviyeyi değiştir</button><button class="btn ghost grow" type="button" data-x="placement">Seviye testini çöz</button></div></section>
        ${P.mode === 'db' ? `<section><h3>Kayıt</h3><p class="hint">Derslerin, kelimelerin ve hataların Claude hesabına bağlı olarak saklanıyor; bu sayfayı başka bir cihazda açtığında da görürsün. Bu kayıtları sadece sen görebilirsin.</p></section>`
          : `<section><h3>Kayıt ve yedek</h3><p class="hint">İlerlemen bu bilgisayardaki tarayıcıda saklanıyor. Tarayıcının geçmişini ve site verilerini silersen kaybolur; ara sıra yedek indir.</p>
          <div class="dock-row"><button class="btn ghost grow" type="button" data-x="backup">Yedeği indir</button><button class="btn ghost grow" type="button" data-x="restore">Yedekten geri yükle</button></div>
          <input type="file" id="restore-file" accept="application/json,.json" hidden><p class="hint" id="backup-msg" role="status"></p></section>`}
        ${P.inViewer ? `<section><h3>İzinler</h3><p class="hint">Mia'nın ders hazırlaması ve cevaplarını kontrol etmesi için bu sayfanın Claude hesabını kullanmasına izin vermen gerekiyor. Bu, Claude kullanım limitinden harcar.</p><button class="btn ghost" type="button" data-x="perms">İzinleri yönet</button></section>` : ''}
        <section><h3>Sıfırla</h3><div id="reset-area"><button class="btn ghost danger" type="button" data-x="reset">Tüm ilerlemeyi sil</button></div></section>
      </div>`;
    if (!P.sample) $('.sheet-head', el).insertAdjacentHTML('afterend', geminiSection());
    wireGemini(el);
    const bk = $('[data-x=backup]', el);
    if (bk) {
      bk.onclick = downloadBackup;
      const fileIn = $('#restore-file', el), msg = $('#backup-msg', el);
      $('[data-x=restore]', el).onclick = () => fileIn.click();
      fileIn.onchange = async () => {
        const f = fileIn.files && fileIn.files[0];
        if (!f) return;
        try { await restoreBackup(f); msg.textContent = 'Yedek geri yüklendi.'; if (S.tab === 'home') renderHome(); }
        catch (e) { msg.textContent = 'Bu dosya bir Learnb yedeği değil ya da bozuk.'; }
      };
    }
    $$('[data-x=close]', el).forEach(b => b.onclick = closeSheet);
    $$('[data-tier]', el).forEach(b => b.onclick = () => {
      if (!S.profile) return toast('Önce bir seviye seç.');
      S.profile.tier = b.dataset.tier; Store.save('profile', S.profile);
      $$('[data-tier]', el).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    });
    $('[data-x=level]', el).onclick = () => { closeSheet(); L = null; renderOnboarding(!!S.profile); };
    $('[data-x=placement]', el).onclick = () => { closeSheet(); L = null; renderPlacement(); };
    const pb = $('[data-x=perms]', el); if (pb) pb.onclick = managePerms;
    $('[data-x=reset]', el).onclick = () => {
      const area = $('#reset-area', el);
      area.innerHTML = '<p class="hint">Bitirdiğin dersler, serin, kelimelerin ve hataların silinir. Hazırlanmış ders içerikleri kalır. Bu geri alınamaz.</p><div class="dock-row"><button class="btn ghost" type="button" data-x="no">Vazgeç</button><button class="btn primary grow" type="button" data-x="yes">Evet, hepsini sil</button></div>';
      $('[data-x=no]', area).onclick = openSettings;
      $('[data-x=yes]', area).onclick = async () => {
        S.profile = null; S.vocab = { words: {} }; S.mistakes = { items: [] }; S.homeLevel = null; L = null; S.chat = null;
        setResume(null);
        await Promise.all(['profile', 'vocab', 'mistakes'].map(n => Store.remove(n)));
        closeSheet();
        renderHome();
      };
    };
    const f = $('[data-x=close].icon-btn', el); if (f && fine()) f.focus();
  }
  function closeSheet() { const el = $('#sheet'); el.hidden = true; el.innerHTML = ''; }

  // Google Gemini anahtarı: kullanıcı kendisi alır ve yapıştırır; anahtar sadece bu tarayıcıda durur
  function geminiSection() {
    const opts = (G.models.length ? rankModels(G.models) : [G.model]).filter(Boolean);
    return `<section id="ai-sec"><h3>Mia'nın yapay zekâsı: Google Gemini</h3>
      <p class="status ${G.key ? 'on' : ''}">${G.key ? `Bağlı${G.model ? ` · model: ${esc(G.model)}` : ''}` : 'Henüz bağlı değil'}</p>
      ${G.key ? '' : `<ol class="steps">
        <li><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a> adresini aç ve Google hesabınla gir.</li>
        <li>"Create API key" (API anahtarı oluştur) düğmesine bas.</li>
        <li>Çıkan uzun kodu kopyala, aşağıya yapıştır ve "Kaydet ve dene"ye bas.</li></ol>`}
      <form class="compose" id="gk-form" autocomplete="off">
        <input class="field" id="gk" type="password" placeholder="${G.key ? 'Yeni anahtar (değiştirmek için)' : 'Google Gemini anahtarını yapıştır'}" aria-label="Google Gemini anahtarı" spellcheck="false">
        <button class="btn primary" id="gk-btn">Kaydet ve dene</button>
      </form>
      <p class="hint" id="gk-msg" role="status"></p>
      ${G.key && opts.length > 1 ? `<label class="hint" for="gm">Model</label><select class="field" id="gm">${opts.map(m => `<option value="${esc(m)}" ${m === G.model ? 'selected' : ''}>${esc(m)}</option>`).join('')}</select>` : ''}
      <p class="hint">Anahtar sadece bu bilgisayardaki tarayıcıda saklanır. Google'ın ücretsiz kullanımında günlük bir istek sınırı vardır ve yazdıkların Google'ın ürünlerini geliştirmek için kullanılabilir; derslere kişisel bilgi yazma.</p>
      ${G.key ? '<button class="btn ghost danger" type="button" data-x="gk-del">Anahtarı sil</button>' : ''}
    </section>`;
  }
  function wireGemini(el) {
    const form = $('#gk-form', el);
    if (!form) return;
    const inp = $('#gk', el), btn = $('#gk-btn', el), msg = $('#gk-msg', el);
    form.onsubmit = async e => {
      e.preventDefault();
      const key = inp.value.trim();
      if (!key) return inp.focus();
      btn.disabled = true;
      msg.textContent = 'Anahtar deneniyor…';
      try {
        await setupGemini(key);
        inp.value = '';
        toast('Mia hazır!');
        refreshAfterAi();
      } catch (err) {
        msg.textContent = errText(err && err.code);
        btn.disabled = false;
      }
    };
    const sel = $('#gm', el);
    if (sel) sel.onchange = () => { G.model = sel.value; lsSet('learnb.gmodel', G.model); toast('Model değişti.'); };
    const del = $('[data-x=gk-del]', el);
    if (del) del.onclick = () => { G.key = ''; G.model = ''; G.models = []; lsSet('learnb.gkey', null); lsSet('learnb.gmodel', null); refreshAfterAi(); };
    if (G.key && !G.models.length) listModels().then(() => { const s2 = $('#ai-sec'); if (s2 && !$('#gm')) { s2.outerHTML = geminiSection(); wireGemini($('#sheet')); } }).catch(() => {});
  }
  function refreshAfterAi() {
    const sec = $('#ai-sec');
    if (sec) { sec.outerHTML = geminiSection(); wireGemini($('#sheet')); }
    if (S.tab === 'home') renderHome(); else if (S.tab === 'chat' && !S.chat) renderChat();
  }

  // Yedek: bu tarayıcıdaki Learnb kayıtlarını (anahtar hariç) dosyaya indirir ya da geri yükler
  function downloadBackup() {
    const data = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('learnb.') && k !== 'learnb.gkey') data[k] = localStorage.getItem(k);
      }
    } catch (e) { return toast('Tarayıcı kaydına ulaşılamadı.'); }
    const blob = new Blob([JSON.stringify({ app: 'learnb', v: 1, at: new Date().toISOString(), data })], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `learnb-yedek-${today()}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  async function restoreBackup(file) {
    const j = JSON.parse(await file.text());
    if (!j || j.app !== 'learnb' || !j.data || typeof j.data !== 'object') throw new Error('not a backup');
    Object.entries(j.data).forEach(([k, v]) => { if (k.startsWith('learnb.') && k !== 'learnb.gkey' && typeof v === 'string') lsSet(k, v); });
    S.docs = {};
    await loadState();
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  // ---------- Genel olaylar ----------
  function goTab(tab) {
    L = null;
    if (tab === 'home') renderHome();
    else if (tab === 'chat') renderChat();
    else if (tab === 'notes') renderNotes();
  }
  const ACT = {
    settings: openSettings,
    home: () => { L = null; renderHome(); },
    onboard: () => renderOnboarding(false),
    notes: () => { S.notesTab = 'words'; renderNotes(); },
    next,
    ask: askMode,
    'lesson-menu': lessonMenu,
    'chat-exit': () => { S.chat = null; renderChat(); },
    review: () => startReview(false),
    'review-all': () => startReview(true),
    placement: renderPlacement
  };
  document.addEventListener('click', e => {
    const w = e.target.closest('.w');
    if (w && !e.target.closest('#pop')) { showWord(w); return; }
    const pop = $('#pop');
    if (!pop.hidden && !e.target.closest('#pop') && !e.target.closest('[data-act=lesson-menu]')) hidePop();
    const a = e.target.closest('[data-act]');
    if (a && ACT[a.dataset.act]) { e.preventDefault(); ACT[a.dataset.act](a); }
    const t = e.target.closest('#nav [data-tab]');
    if (t) goTab(t.dataset.tab);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { hidePop(); closeSheet(); return; }
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^[1-6]$/.test(e.key)) { const o = $$('#dock .opt, #main .placement .opt')[+e.key - 1]; if (o) { e.preventDefault(); o.click(); } }
  });
  $('#main').addEventListener('scroll', () => { if (!$('#pop').hidden) hidePop(); }, { passive: true });
  window.addEventListener('resize', () => hidePop());

  // ---------- Açılış ----------
  async function loadState() {
    const [profile, vocab, mistakes] = await Promise.all(['profile', 'vocab', 'mistakes'].map(n => Store.load(n)));
    S.profile = profile && profile.level && LEVEL[profile.level] ? profile : null;
    if (S.profile) { S.profile.done = S.profile.done || {}; S.profile.streak = S.profile.streak || { n: 0, last: null }; }
    S.vocab = vocab && vocab.words && typeof vocab.words === 'object' ? vocab : { words: {} };
    S.mistakes = mistakes && Array.isArray(mistakes.items) ? mistakes : { items: [] };
  }
  async function boot() {
    // İnternetten açıldığında (telefon) dosyaları sakla ve kayıtların silinmemesini iste
    if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    renderHome();
    await connect();
    await loadState();
    S.loading = false;
    if (S.tab === 'home') renderHome();
  }
  boot();
})();
