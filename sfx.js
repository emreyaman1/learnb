/* Learnb: ses efektleri. Hiçbir ses dosyası yok; sesler tarayıcının kendi ses motoruyla anında üretilir
   (internet gerekmez, indirme yok). Ayar localStorage'da 'learnb.sound' anahtarında durur: '0' = kapalı.
   Tasarım ilkesi: kısa, yumuşak, alçak sesli. Doğru cevap çan gibi tatlı bir "ding-ding", art arda doğrularda
   perde basamak basamak yükselir; yanlış cevap azarlamaz, yumuşak ve alçak bir "bom-bom" olur. */
(() => {
  'use strict';
  const KEY = 'learnb.sound';
  const enabled = () => { try { return localStorage.getItem(KEY) !== '0'; } catch (e) { return true; } };

  // Do majör pentatonik (C5 D5 E5 G5 A5 C6 D6 E6): hangi iki notayı arka arkaya çalsak kulağa hoş gelir
  const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];

  let ctx = null, bus = null, combo = 0, lastTap = 0, lastSpecial = 0, lastName = '', lastNameAt = 0;

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
      // Yalnızca üst üste binen sesleri törpüler; tek tek küçük sesleri kısmaz (yoksa "tık" duyulmaz olur)
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

  const SOUND = {
    // Küçük "tık": her dokunuşta çalan, neredeyse duyulmayan baloncuk sesi
    tap(t) { tone(620 * (0.96 + Math.random() * 0.08), t, 0.05, { gain: 0.13, attack: 0.003, glide: 400 }); },
    // Doğru cevap: iki notalık tatlı çan; art arda doğrularda yukarı çıkar
    ok(t) {
      const i = Math.min(combo, 5);
      combo++;
      bell(SCALE[i], t, 0.5, 0.2);
      bell(SCALE[i + 2], t + 0.095, 0.7, 0.19);
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
    pair(t, n = 0) { bell(SCALE[Math.min(Math.max(n, 0), 7)], t, 0.28, 0.17); },
    // Eşleştirmede yanlış çift: tok, kısa bir "tup"
    miss(t) { tone(190, t, 0.14, { gain: 0.2, attack: 0.008, glide: 115 }); },
    // Ders ya da test bitişi: yıldız sayısına göre uzayan arpej + alt tarafta yumuşak bir zemin
    fanfare(t, stars = 2) {
      const run = stars >= 3 ? [0, 2, 3, 5, 7] : stars === 2 ? [0, 2, 3, 5] : [0, 2, 3];
      tone(261.63, t, 0.9, { type: 'triangle', gain: 0.07, attack: 0.03 });
      run.forEach((k, n) => bell(SCALE[k], t + n * 0.085, n === run.length - 1 ? 1 : 0.4, 0.17));
      if (stars >= 3) [2093, 2637, 3136].forEach((f, n) => bell(f, t + 0.5 + n * 0.07, 0.4, 0.04));
    },
    // Ayarlardan sesi açınca duyulan örnek
    preview(t) { bell(SCALE[1], t, 0.45, 0.19); bell(SCALE[3], t + 0.095, 0.65, 0.18); }
  };

  function play(name, arg) {
    if (!enabled() || document.hidden || !SOUND[name] || !boot()) return;
    const now = performance.now();
    if (name === 'tap') {
      if (now - lastTap < 70 || now - lastSpecial < 140) return; // özel bir ses çaldıysa "tık" susar
      lastTap = now;
    } else {
      if (name === lastName && now - lastNameAt < 60) return; // aynı ses çift tetiklenirse tek çal
      lastName = name; lastNameAt = lastSpecial = now;
    }
    awake();
    try { SOUND[name](ctx.currentTime + 0.012, arg); } catch (e) { /* ses çalamazsa uygulama etkilenmesin */ }
  }

  // Tarayıcılar sesi ancak bir dokunuştan sonra açar: ilk dokunuşta ses motorunu hazırla
  const unlock = () => { if (enabled() && boot()) awake(); };
  ['pointerdown', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) awake(); });

  // Genel dokunuş sesi: düğme, bağlantı, seçenek ve anahtarlara basılınca (uygulamanın özel sesleri varsa o çalar)
  document.addEventListener('click', e => {
    const el = e.target.closest && e.target.closest('button, a[href], .switch, [data-act], [data-tab], .opt, .chip-w, .mbtn');
    if (el && !el.disabled && el.getAttribute('aria-disabled') !== 'true') play('tap');
  });

  window.Sfx = { play, enabled, reset() { combo = 0; } };
})();
