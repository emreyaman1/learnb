/* Learnb: ses efektleri. Hiçbir ses dosyası yok; sesler tarayıcının kendi ses motoruyla anında üretilir
   (internet gerekmez, indirme yok). Ayar localStorage'da 'learnb.sound' anahtarında durur: '0' = kapalı.
   Tasarım ilkesi: kısa, yumuşak, alçak sesli, ve her eylemin kendi sesi olsun. Sıradan düğmelere basmak
   ses çıkarmaz (hep aynı "tık"ı duymak rahatsız eder). Doğru cevap çan gibi bir "ding-ding", yanlış cevap
   yumuşak bir "bom-bom", cümle kurarken her kelime melodinin bir notası, ders bitince kutlama çalar. */
(() => {
  'use strict';
  const KEY = 'learnb.sound';
  const enabled = () => { try { return localStorage.getItem(KEY) !== '0'; } catch (e) { return true; } };

  // Do majör pentatonik (C5 D5 E5 G5 A5 C6 D6 E6): hangi iki notayı arka arkaya çalsak kulağa hoş gelir
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];

  let ctx = null, bus = null, noise = null, combo = 0, lastName = '', lastNameAt = 0;

  function boot() {
    if (ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      // Ses zinciri: ana ses kısıcı → yumuşatıcı filtre (tiz kenarları keser) → sıkıştırıcı (üst üste binince patlamasın)
      const master = ctx.createGain(); master.gain.value = 0.55;
      const soft = ctx.createBiquadFilter(); soft.type = 'lowpass'; soft.frequency.value = 6500; soft.Q.value = 0.4;
      const comp = ctx.createDynamicsCompressor();
      // Yalnızca üst üste binen sesleri törpüler; tek tek küçük sesleri kısmaz
      comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.15;
      master.connect(soft); soft.connect(comp); comp.connect(ctx.destination);
      bus = master;
      return true;
    } catch (e) { ctx = null; return false; }
  }
  const awake = () => { if (ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) { /* yok say */ } } };

  // Tek bir yumuşak nota: sessizlikten hızlıca yükselir, sonra yavaşça söner
  function tone(freq, at, dur, { type = 'sine', gain = 0.2, attack = 0.006, glide = 0 } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(bus);
    o.start(at); o.stop(at + dur + 0.04);
  }
  // Çan sesi: asıl nota + daha tiz, çabuk sönen iki yan ses (tokmakla vurulmuş gibi)
  function bell(freq, at, dur, gain) {
    tone(freq, at, dur, { gain });
    tone(freq * 2, at, dur * 0.5, { gain: gain * 0.22 });
    tone(freq * 3.01, at, dur * 0.28, { gain: gain * 0.07 });
  }
  // Tahta/marimba gibi kısa, tok bir nota (çandan farklı bir karakter)
  function pluck(freq, at, dur, gain) {
    tone(freq, at, dur, { type: 'triangle', gain, attack: 0.004 });
    tone(freq * 2, at, dur * 0.4, { gain: gain * 0.25, attack: 0.003 });
  }
  // Gürültüden (hışırtı) yapılan kısa "vuuş" sesi: filtrenin frekansı f0'dan f1'e kayar
  function swish(at, dur, f0, f1, gain) {
    if (!noise) {
      noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 0.5), ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noise;
    f.type = 'bandpass'; f.Q.value = 1.4;
    f.frequency.setValueAtTime(f0, at); f.frequency.exponentialRampToValueAtTime(f1, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f); f.connect(g); g.connect(bus);
    src.start(at); src.stop(at + dur + 0.04);
  }
  const jitter = (x, r = 0.04) => x * (1 - r + Math.random() * 2 * r);
  const top = n => SCALE[Math.min(Math.max(Math.floor(n) || 0, 0), SCALE.length - 1)];

  // Her eylemin kendi sesi var. Sık yapılan eylemler (devam, kelime) çok kısık ve her seferinde hafif farklı tutuldu.
  const SOUND = {
    // Doğru cevap: iki notalık tatlı çan; art arda doğrularda yukarı çıkar, ikinci nota ara sıra değişir
    ok(t) {
      const i = Math.min(combo, 5);
      combo++;
      bell(SCALE[i], t, 0.5, 0.2);
      bell(top(i + (Math.random() < 0.35 ? 3 : 2)), t + 0.095, 0.7, 0.19);
      if (i >= 4) bell(2093, t + 0.2, 0.5, 0.05); // üst üste çok doğru yapınca hafif ışıltı
    },
    // Neredeyse: nötr, "az kalsın" der gibi iki yumuşak nota
    almost(t) { bell(SCALE[3], t, 0.35, 0.15); bell(SCALE[2], t + 0.12, 0.5, 0.13); },
    // Yanlış cevap: azarlamayan, alçak ve yumuşak iki nota
    bad(t) {
      combo = 0;
      tone(330, t, 0.24, { gain: 0.2, attack: 0.01, glide: 300 });
      tone(262, t + 0.14, 0.38, { gain: 0.2, attack: 0.01, glide: 240 });
    },
    // Eşleştirmede doğru çift: her çift bir önceki çiftten bir basamak yukarıda
    pair(t, n = 0) { bell(top(n), t, 0.28, 0.17); },
    // Eşleştirmede yanlış çift: tok, kısa bir "tup"
    miss(t) { tone(190, t, 0.14, { gain: 0.2, attack: 0.008, glide: 115 }); },
    // Ders ya da test bitişi: yıldız sayısına göre uzayan arpej + alt tarafta yumuşak bir zemin
    fanfare(t, stars = 2) {
      const run = stars >= 3 ? [0, 2, 3, 5, 7] : stars === 2 ? [0, 2, 3, 5] : [0, 2, 3];
      tone(261.63, t, 0.9, { type: 'triangle', gain: 0.07, attack: 0.03 });
      run.forEach((k, n) => bell(SCALE[k], t + n * 0.085, n === run.length - 1 ? 1 : 0.4, 0.17));
      if (stars >= 3) [2093, 2637, 3136].forEach((f, n) => bell(f, t + 0.5 + n * 0.07, 0.4, 0.04));
    },
    // Cümle kurarken kelime koyma: her kelime bir basamak yukarı, cümle melodi gibi büyür
    place(t, n = 0) { pluck(top(n), t, 0.2, 0.17); },
    // Kelimeyi geri alma: aşağı kayan kısa nota
    unplace(t) { tone(440, t, 0.09, { gain: 0.13, attack: 0.004, glide: 320 }); },
    // Son kelime de yerine oturunca: cümle tamam, küçük bir "oldu" akoru
    ready(t) { [0, 2, 3].forEach((k, n) => pluck(SCALE[k], t + n * 0.03, 0.35, 0.13)); },
    // Temizle: aşağı doğru kısa bir süpürme
    sweep(t) { swish(t, 0.16, 2200, 500, 0.07); },
    // Devam: çok hafif, her seferinde biraz farklı bir "vuuş" (sayfa çevirir gibi)
    next(t) { const a = jitter(900, 0.25); swish(t, 0.13, a, a * 2.2, 0.05); },
    // Sekme değiştirme: sekmeye göre farklı perdede yumuşak nota (n: 0 ana sayfa, 1 sohbet, 2 defter)
    tab(t, n = 0) { const f = [392, 494, 587][n] || 440; tone(f, t, 0.12, { type: 'triangle', gain: 0.14, attack: 0.005, glide: f * 1.06 }); },
    // Kelimeye dokununca anlam açılması: yukarı doğru küçük bir baloncuk
    pop(t) { tone(jitter(330), t, 0.08, { gain: 0.14, attack: 0.004, glide: 720 }); },
    // Ayarlar ve pencereler: açılırken yukarı, kapanırken aşağı kayar
    open(t) { tone(380, t, 0.14, { gain: 0.1, attack: 0.01, glide: 760 }); },
    close(t) { tone(700, t, 0.12, { gain: 0.09, attack: 0.01, glide: 360 }); },
    // Anahtar açıldı / kapandı
    on(t) { tone(500, t, 0.07, { gain: 0.13 }); tone(750, t + 0.07, 0.1, { gain: 0.13 }); },
    off(t) { tone(750, t, 0.07, { gain: 0.1 }); tone(500, t + 0.07, 0.1, { gain: 0.1 }); },
    // Seviye ya da dil seçme: iki yumuşak nota
    pick(t) { pluck(SCALE[2], t, 0.16, 0.14); pluck(SCALE[4], t + 0.07, 0.22, 0.14); },
    // Ders başlıyor: hızlı, hafif yükselen üç nota
    start(t) { [0, 3, 5].forEach((k, n) => bell(SCALE[k], t + n * 0.075, 0.3, 0.12)); },
    // Ders kaydedildi, seri işlendi: bozuk para toplar gibi iki parlak nota
    coin(t) { bell(1318.51, t, 0.18, 0.15); bell(1760, t + 0.085, 0.55, 0.15); },
    // Sohbette mesaj gönderme: yukarı kayan hafif vuuş
    send(t) { tone(420, t, 0.11, { gain: 0.13, attack: 0.006, glide: 840 }); swish(t, 0.12, 1200, 3000, 0.03); },
    // Mia'nın cevabı geldi: yumuşak, tek notalık küçük çan
    recv(t) { bell(SCALE[3], t, 0.3, 0.1); },
    // Kart çevirme: iki kısa, yükselen tahta sesi
    flip(t) { pluck(520, t, 0.06, 0.12); pluck(780, t + 0.05, 0.08, 0.12); },
    // Defterine ekleme: içeri düşen yumuşak damla; "bilmiyordum": alçak, hafif bir nota
    plop(t) { tone(560, t, 0.11, { gain: 0.15, attack: 0.005, glide: 250 }); },
    soft(t) { tone(280, t, 0.16, { gain: 0.1, attack: 0.01, glide: 235 }); }
  };

  function play(name, arg) {
    if (!enabled() || document.hidden || !SOUND[name] || !boot()) return;
    const now = performance.now();
    if (name === lastName && now - lastNameAt < 60) return; // aynı ses çift tetiklenirse tek çal
    lastName = name; lastNameAt = now;
    awake();
    try { SOUND[name](ctx.currentTime + 0.012, arg); } catch (e) { /* ses çalamazsa uygulama etkilenmesin */ }
  }

  // Tarayıcılar sesi ancak bir dokunuştan sonra açar: ilk dokunuşta ses motorunu hazırla
  const unlock = () => { if (enabled() && boot()) awake(); };
  ['pointerdown', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) awake(); });

  // Uygulamanın kendi çaldığı seslerin (doğru, yanlış, kelime koyma…) dışında kalan eylemler burada ses alır.
  // Sıradan düğmelere basmak ses çıkarmaz: her şeye ses vermek aynı sesi sürekli duymak demek ve rahatsız eder.
  document.addEventListener('click', e => {
    const t = e.target;
    if (!t || !t.closest) return;
    const tab = t.closest('#nav [data-tab]');
    if (tab) return play('tab', ['home', 'chat', 'notes'].indexOf(tab.dataset.tab));
    if (t.closest('.w') && !t.closest('#pop')) return play('pop');
    if (t.closest('[data-act=next]')) return play('next');
    if (t.closest('[data-act=settings], [data-act=lang], [data-act=lesson-menu]')) return play('open');
    if (t.closest('[data-x=close], .sheet-back')) return play('close');
    if (t.closest('[data-start]')) return play('start');
    if (t.closest('[data-level], [data-lang], .seg button')) return play('pick');
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t && t.matches && t.matches('.switch input')) play(t.checked ? 'on' : 'off');
  });

  window.Sfx = { play, enabled, reset() { combo = 0; } };
})();
