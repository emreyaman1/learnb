/* guide.js — Learnb kurulum ve telefon rehber animasyonları */
(function () {
  'use strict';

  // ---------- Yardımcılar ----------
  var esc = function (s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var h = function (html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  var lsGet = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var lsSet = function (k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* yok say */ } };
  var ymd = function () {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  // ---------- beforeinstallprompt ----------
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
  });

  // ---------- SVG'ler ----------
  var CURSOR_SVG = '<svg class="kd-cursor" viewBox="0 0 24 24" fill="var(--ink)" opacity=".8">' +
    '<path d="M5 2l12 10h-7l4 9-2.5 1-4-9-2.5 4z"/></svg>';

  var COPY_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">' +
    '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>';

  var CHECK_SM = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="var(--ok)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3 8.5l3.5 3.5L13 5"/></svg>';

  var SHARE_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4M12 3v12M8 7l4-4 4 4"/></svg>';

  // ---------- 1) keyDemo ----------
  function keyDemo() {
    var root = h('<div class="kd" data-s="1"></div>');

    var captions = [
      '1. aistudio.google.com/apikey sayfasını aç, Google hesabınla gir ve \u201cCreate API key\u201d (anahtar oluştur) düğmesine bas.',
      '2. Açılan küçük pencerede \u201cCreate key\u201d düğmesine bas. Senden bir proje seçmeni isterse listeden herhangi birini seç.',
      '3. Oluşan uzun kodun yanındaki kopyala simgesine bas.',
      '4. Learnb\u2019ye dön, kodu kutuya yapıştır. Mia hazır!'
    ];
    var urls = [
      'aistudio.google.com/apikey',
      'aistudio.google.com/apikey',
      'aistudio.google.com/apikey',
      'emreyaman1.github.io/learnb'
    ];

    // Sahne 1: API keys sayfası
    var page1 = '<div class="kd-heading">API Keys</div>' +
      '<div class="kd-lines"><div class="kd-line" style="width:80%"></div>' +
      '<div class="kd-line" style="width:60%"></div></div>' +
      '<div class="kd-btn-blue">Create API key</div>';

    // Sahne 2: Modal
    var page2 = '<div class="kd-heading">API Keys</div>' +
      '<div class="kd-lines"><div class="kd-line" style="width:80%"></div></div>' +
      '<div class="kd-modal">' +
      '<div class="kd-modal-title">Create API key</div>' +
      '<div class="kd-select-ph"></div>' +
      '<div class="kd-btn-blue">Create key</div></div>';

    // Sahne 3: Anahtar satırı
    var page3 = '<div class="kd-heading">API Keys</div>' +
      '<div class="kd-key-row"><span>AQ.Ab8\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20227Kq</span>' +
      '<span class="kd-copy-icon">' + COPY_SVG + '<span class="kd-copied">Kopyalandı</span></span></div>';

    // Sahne 4: Learnb kartı
    var page4 = '<div class="kd-lb-card">' +
      '<div class="kd-lb-title">Mia\u2019yı çalıştıralım</div>' +
      '<div class="kd-lb-input"><span class="kd-typing">AQ.Ab8\u2022\u2022\u2022\u20227Kq</span></div>' +
      '<div class="kd-badge">' + CHECK_SM + ' Mia hazır!</div></div>';

    var pages = [page1, page2, page3, page4];

    // Sahne yapısı
    var stage = h('<div class="kd-stage" aria-hidden="true"></div>');
    var bar = h('<div class="kd-bar"><span class="kd-lock"></span><span class="kd-url">' + esc(urls[0]) + '</span></div>');
    var page = h('<div class="kd-page">' + pages[0] + '</div>');
    var cursor = h(CURSOR_SVG);
    var ripple = h('<div class="kd-ripple"></div>');

    stage.appendChild(bar);
    stage.appendChild(page);
    stage.appendChild(cursor);
    stage.appendChild(ripple);
    root.appendChild(stage);

    var captionEl = h('<div class="kd-caption">' + esc(captions[0]) + '</div>');
    root.appendChild(captionEl);

    // Dot düğmeleri
    var dotsWrap = h('<div class="kd-dots"></div>');
    var dots = [];
    for (var i = 0; i < 4; i++) {
      var dot = h('<button type="button" class="kd-dot" aria-label="' + (i + 1) + '. adım" aria-current="' + (i === 0) + '"></button>');
      (function (idx) { dot.addEventListener('click', function () { goTo(idx); }); })(i);
      dots.push(dot);
      dotsWrap.appendChild(dot);
    }
    root.appendChild(dotsWrap);

    var current = 0;
    var timer = null;

    function goTo(idx) {
      current = idx;
      root.setAttribute('data-s', String(idx + 1));
      bar.querySelector('.kd-url').textContent = urls[idx];
      page.innerHTML = pages[idx];
      captionEl.textContent = captions[idx];
      dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === idx)); });
      // Dalga konumu güncelle
      positionRipple(idx);
      resetTimer();
    }

    // İmleç ve dalga, o sahnedeki gerçek hedef öğenin ortasına gider (ölçü sayfaya yerleşince alınır)
    var TARGETS = ['.kd-btn-blue', '.kd-modal .kd-btn-blue', '.kd-copy-icon', '.kd-lb-input'];
    function positionRipple(idx) {
      var el = page.querySelector(TARGETS[idx]), sr = stage.getBoundingClientRect();
      if (!el || !sr.width) return;
      var r = el.getBoundingClientRect(), x = r.left + r.width / 2 - sr.left, y = r.top + r.height / 2 - sr.top;
      ripple.style.left = (x - 10) + 'px';
      ripple.style.top = (y - 10) + 'px';
      root.style.setProperty('--tx' + (idx + 1), x + 'px');
      root.style.setProperty('--ty' + (idx + 1), y + 'px');
    }
    var waitFrames = 0;
    requestAnimationFrame(function firstMeasure() {
      if (root.isConnected) positionRipple(current);
      else if (++waitFrames < 300) requestAnimationFrame(firstMeasure);
    });

    function advance() {
      if (!root.isConnected) { clearInterval(timer); timer = null; return; }
      if (document.hidden) return;
      goTo((current + 1) % 4);
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      timer = setInterval(advance, 3400);
    }

    // Başlangıç konumları
    positionRipple(0);
    resetTimer();

    return root;
  }

  // ---------- 2) phoneTip ----------
  var ptOpen = false;

  function phoneTip(opts) {
    if (ptOpen) return;
    ptOpen = true;
    opts = opts || {};
    var url = opts.url || 'https://emreyaman1.github.io/learnb/';

    var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    var android = /Android/.test(navigator.userAgent);
    var mobile = ios || android;

    var prevFocus = document.activeElement;

    // Kayıt
    lsSet('learnb.phonetip.last', ymd());

    var wrap = h('<div class="pt-wrap"></div>');
    var back = h('<div class="pt-back"></div>');
    wrap.appendChild(back);

    var dialog = h('<div class="pt" role="dialog" aria-modal="true" aria-labelledby="pt-title"></div>');
    wrap.appendChild(dialog);

    // Başlık
    var head = h('<div class="pt-head"><h2 id="pt-title">Learnb\u2019yi telefonunda kullan</h2>' +
      '<button class="icon-btn" type="button" aria-label="Kapat">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>');
    dialog.appendChild(head);

    // PWA düğmesi (telefonda, beforeinstallprompt varsa)
    if (mobile && deferred) {
      var installBtn = h('<button class="btn primary wide pt-install" type="button">Ana ekrana ekle</button>');
      installBtn.addEventListener('click', function () {
        if (!deferred) return;
        deferred.prompt();
        deferred.userChoice.then(function () { deferred = null; close(); });
      });
      dialog.appendChild(installBtn);
    }

    // Gövde
    var body = h('<div class="pt-body"></div>');
    dialog.appendChild(body);

    // QR bölümü (masaüstünde)
    if (!mobile) {
      var qr = h('<div class="pt-qr">' +
        '<img src="icons/qr.svg" alt="QR kod" width="168" height="168">' +
        '<span class="pt-qr-text">Telefonunun kamerasını bu kareye tut, çıkan bağlantıya dokun.</span>' +
        '<span class="pt-qr-url">' + esc(url.replace(/^https?:\/\//, '')) + '</span></div>');
      body.appendChild(qr);
    }

    // Telefon animasyonu
    var phoneArea = h('<div class="pt-phone-area"></div>');
    body.appendChild(phoneArea);

    // Sekme: iPhone / Android
    var activeTab = ios ? 'iphone' : 'android';
    var seg = h('<div class="pt-seg">' +
      '<button type="button" aria-pressed="' + (activeTab === 'iphone') + '">iPhone</button>' +
      '<button type="button" aria-pressed="' + (activeTab === 'android') + '">Android</button></div>');
    phoneArea.appendChild(seg);

    var phoneContainer = h('<div></div>');
    phoneArea.appendChild(phoneContainer);

    var descEl = h('<div class="ph-desc"></div>');
    phoneArea.appendChild(descEl);

    // iPhone sahneleri
    var iphoneScenes = [
      { desc: '1. Safari\u2019de Learnb\u2019yi aç, alttaki Paylaş düğmesine dokun.' },
      { desc: '2. Listeyi biraz kaydır, \u201cAna Ekrana Ekle\u201dye dokun.' },
      { desc: '3. Sağ üstteki \u201cEkle\u201dye dokun.' },
      { desc: '4. Learnb artık ana ekranında. Uygulama gibi açılır.' }
    ];
    var androidScenes = [
      { desc: '1. Chrome\u2019da Learnb\u2019yi aç, sağ üstteki \u22ee (üç nokta) menüsüne dokun.' },
      { desc: '2. \u201cAna ekrana ekle\u201dye dokun. Bazı telefonlarda \u201cUygulamayı yükle\u201d yazar.' },
      { desc: '3. \u201cEkle\u201dye dokun.' },
      { desc: '4. Learnb artık ana ekranında. Uygulama gibi açılır.' }
    ];

    var phoneTimer = null;
    var phoneStep = 0;

    function buildPhone() {
      if (phoneTimer) { clearInterval(phoneTimer); phoneTimer = null; }
      phoneStep = 0;
      var isIphone = activeTab === 'iphone';
      var scenes = isIphone ? iphoneScenes : androidScenes;

      var phone = h('<div class="ph" data-s="1"></div>');
      var screen = h('<div class="ph-screen"></div>');
      phone.appendChild(screen);

      // Parmak izi
      var finger = h('<div class="ph-finger"></div>');

      if (isIphone) {
        // Safari benzeri
        screen.innerHTML = '<div class="ph-content">' +
          '<div style="font:600 10px/1.3 var(--f-display);margin:0 0 4px">Learnb</div>' +
          '<div class="kd-lines"><div class="kd-line" style="width:80%"></div><div class="kd-line" style="width:55%"></div></div>' +
          '<div class="ph-share-list">' +
          '<div class="ph-share-item">Kopyala</div>' +
          '<div class="ph-share-item">Okuma Listesine Ekle</div>' +
          '<div class="ph-share-item hl">\u2795 Ana Ekrana Ekle</div></div>' +
          '</div>' +
          '<div class="ph-safari-bar"><span></span><span class="ph-share-icon">' + SHARE_SVG + '</span></div>';
      } else {
        // Chrome benzeri
        screen.innerHTML = '<div class="ph-bar"><span class="ph-bar-url">learnb</span><span class="ph-bar-dots">\u22ee</span></div>' +
          '<div class="ph-content">' +
          '<div style="font:600 10px/1.3 var(--f-display);margin:0 0 4px">Learnb</div>' +
          '<div class="kd-lines"><div class="kd-line" style="width:80%"></div><div class="kd-line" style="width:55%"></div></div>' +
          '<div class="ph-menu">' +
          '<div class="ph-menu-item">Yeni sekme</div>' +
          '<div class="ph-menu-item">Geçmiş</div>' +
          '<div class="ph-menu-item hl">Ana ekrana ekle</div>' +
          '<div class="ph-menu-item">Ayarlar</div></div>' +
          '</div>';
      }
      phone.appendChild(finger);

      phoneContainer.innerHTML = '';
      phoneContainer.appendChild(phone);

      // Sahne değiştirme
      function setScene(idx) {
        phoneStep = idx;
        phone.setAttribute('data-s', String(idx + 1));
        descEl.textContent = scenes[idx].desc;

        // İçeriği sahneye göre güncelle
        var content = phone.querySelector('.ph-content');
        if (idx === 2) {
          // Onay ekranı
          content.innerHTML = '<div class="ph-confirm">' +
            '<img src="icons/icon-192.png" alt="Learnb" width="36" height="36">' +
            '<div class="ph-confirm-name">Learnb</div>' +
            '<div class="ph-confirm-btns">' +
            (isIphone
              ? '<span></span><span class="ph-confirm-btn primary">Ekle</span>'
              : '<span class="ph-confirm-btn">İptal</span><span class="ph-confirm-btn primary">Ekle</span>') +
            '</div></div>';
          // Gizle: menü/liste
          var menu = phone.querySelector('.ph-menu');
          var list = phone.querySelector('.ph-share-list');
          if (menu) menu.style.opacity = '0';
          if (list) list.style.transform = 'translateY(100%)';
        } else if (idx === 3) {
          // Ana ekran
          content.innerHTML = '<div class="ph-homescreen">' +
            '<div class="ph-hs-icon"></div><div class="ph-hs-icon"></div>' +
            '<div class="ph-hs-icon"></div><div class="ph-hs-icon"></div>' +
            '<div class="ph-hs-icon"></div>' +
            '<div class="ph-hs-icon lb"><img src="icons/icon-192.png" alt="Learnb"></div>' +
            '<div class="ph-hs-icon"></div><div class="ph-hs-icon"></div></div>';
          var safari = phone.querySelector('.ph-safari-bar');
          if (safari) safari.style.display = 'none';
          var bar2 = phone.querySelector('.ph-bar');
          if (bar2) bar2.style.display = 'none';
        }

        // Parmak izi animasyonu (sahneler 1-3)
        if (idx < 3) {
          animateFinger(phone, finger, idx, isIphone);
        } else {
          finger.style.opacity = '0';
        }
      }

      // İlk sahne
      descEl.textContent = scenes[0].desc;
      if (0 < 3) animateFinger(phone, finger, 0, isIphone);

      phoneTimer = setInterval(function () {
        if (!wrap.isConnected) { clearInterval(phoneTimer); phoneTimer = null; return; }
        if (document.hidden) return;
        setScene((phoneStep + 1) % 4);
      }, 3000);
    }

    function animateFinger(phone, finger, idx, isIphone) {
      // Parmak hedef konumları (yaklaşık yüzde)
      var targets;
      if (isIphone) {
        targets = [
          { x: 78, y: 92 },  // Paylaş simgesi
          { x: 50, y: 82 },  // Ana Ekrana Ekle
          { x: 80, y: 20 }   // Ekle
        ];
      } else {
        targets = [
          { x: 85, y: 12 },  // üç nokta
          { x: 70, y: 55 },  // Ana ekrana ekle
          { x: 68, y: 56 }   // Ekle
        ];
      }
      var t = targets[idx];
      finger.style.opacity = '0';
      finger.style.left = '50%';
      finger.style.top = '50%';
      // Kısa gecikme ile hedefe kaydir
      setTimeout(function () {
        finger.style.transition = 'left .8s ease, top .8s ease, opacity .3s';
        finger.style.opacity = '0.5';
        finger.style.left = t.x + '%';
        finger.style.top = t.y + '%';
      }, 200);
      // Dokunma efekti
      setTimeout(function () {
        finger.style.opacity = '0.8';
        finger.style.transform = 'scale(1.15)';
      }, 1200);
      setTimeout(function () {
        finger.style.opacity = '0';
        finger.style.transform = 'scale(1)';
        finger.style.transition = 'none';
      }, 1800);
    }

    // Sekme değişimi
    var segBtns = seg.querySelectorAll('button');
    segBtns[0].addEventListener('click', function () {
      activeTab = 'iphone';
      segBtns[0].setAttribute('aria-pressed', 'true');
      segBtns[1].setAttribute('aria-pressed', 'false');
      buildPhone();
    });
    segBtns[1].addEventListener('click', function () {
      activeTab = 'android';
      segBtns[0].setAttribute('aria-pressed', 'false');
      segBtns[1].setAttribute('aria-pressed', 'true');
      buildPhone();
    });

    buildPhone();

    // İpuçları
    var hints = h('<div class="pt-hints">' +
      '<p class="hint">Telefonda bir şey kurman gerekmez; Mia orada da hemen çalışır. Kendi Google anahtarını kullanıyorsan onu telefondaki Learnb’ye de bir kez yapıştırman yeterli.</p>' +
      '<p class="hint">Not: Derslerin, kelimelerin ve serin her cihazda ayrı saklanır.</p></div>');
    dialog.appendChild(hints);

    // Alt düğmeler
    var footer = h('<div class="pt-footer dock-row">' +
      '<button class="btn ghost" type="button" data-x="never">Bir daha gösterme</button>' +
      '<button class="btn primary grow" type="button" data-x="ok">Tamam</button></div>');
    dialog.appendChild(footer);

    document.body.appendChild(wrap);

    // Kapatma
    function close() {
      if (phoneTimer) { clearInterval(phoneTimer); phoneTimer = null; }
      wrap.remove();
      ptOpen = false;
      if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) { /* */ }
    }

    back.addEventListener('click', close);
    head.querySelector('button').addEventListener('click', close);
    footer.querySelector('[data-x="never"]').addEventListener('click', function () {
      lsSet('learnb.phonetip.never', '1');
      close();
    });
    footer.querySelector('[data-x="ok"]').addEventListener('click', close);

    // Esc
    function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
    }
    document.addEventListener('keydown', onKey);

    // Odak
    var okBtn = footer.querySelector('[data-x="ok"]');
    if (window.matchMedia && matchMedia('(pointer: fine)').matches && okBtn) {
      okBtn.focus({ preventScroll: true });
    }
  }

  // ---------- 3) maybePhoneTip ----------
  var shownThisSession = false;

  function maybePhoneTip(opts) {
    // Ana ekrandan açılmamış olmalı
    if (window.matchMedia) {
      if (matchMedia('(display-mode: standalone)').matches) return false;
    }
    if (navigator.standalone === true) return false;

    // Bir daha gösterme
    if (lsGet('learnb.phonetip.never')) return false;

    // En az 4 gün önce gösterilmiş olmalı
    var last = lsGet('learnb.phonetip.last');
    if (last) {
      var today = ymd();
      var lastDate = new Date(last + 'T00:00:00');
      var nowDate = new Date(today + 'T00:00:00');
      var diff = Math.floor((nowDate - lastDate) / 86400000);
      if (diff < 4) return false;
    }

    // Bu oturumda zaten gösterildi
    if (shownThisSession) return false;

    // Sayfa görünür olmalı
    if (document.visibilityState !== 'visible') return false;

    // #sheet gizli ya da yok
    var sheet = document.getElementById('sheet');
    if (sheet && !sheet.hidden) return false;

    // Başka pt-wrap yok
    if (document.querySelector('.pt-wrap')) return false;

    shownThisSession = true;
    phoneTip(opts);
    return true;
  }

  // ---------- Dışa aç ----------
  window.LearnbGuide = {
    keyDemo: keyDemo,
    phoneTip: phoneTip,
    maybePhoneTip: maybePhoneTip
  };
})();
