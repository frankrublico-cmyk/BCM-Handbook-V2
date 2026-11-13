/* BCM Handbook - "I-install ang App" nga button (para sa index.html) */
(function () {
  'use strict';
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  if (standalone) return;
  try { if (sessionStorage.getItem('bcmInstallHide')) return; } catch (e) {}
  var deferred = null, bar = null;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

  function css() {
    var s = document.createElement('style');
    s.textContent = '.bcm-inst{position:fixed;left:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:99970;display:flex;align-items:center;gap:6px;background:rgba(10,12,18,.95);border:2px solid #d4af37;border-radius:30px;padding:4px 4px 4px 4px;box-shadow:0 0 18px rgba(212,175,55,.45);font-family:"Outfit",system-ui,sans-serif}' +
      '.bcm-inst button{border:0;cursor:pointer;font:700 .9rem "Outfit",system-ui,sans-serif}' +
      '.bcm-inst .go{display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#ffd700,#ff9d00);color:#1a1200;border-radius:26px;padding:8px 14px 8px 8px}' +
      '.bcm-inst .go img{width:28px;height:28px;border-radius:7px}' +
      '.bcm-inst .no{background:transparent;color:#fff;width:30px;height:30px;font-size:1rem}' +
      '.bcm-ios{position:fixed;inset:0;z-index:99971;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;padding:20px}' +
      '.bcm-ios div{max-width:340px;background:#0b0f17;color:#eef2f8;border:2px solid #d4af37;border-radius:18px;padding:20px;font:500 1rem/1.6 "Outfit",system-ui,sans-serif;text-align:center}' +
      '.bcm-ios b{color:#ffd700}.bcm-ios button{margin-top:12px;border:0;border-radius:10px;padding:10px 20px;background:#ffd700;font-weight:800}';
    document.head.appendChild(s);
  }
  function show(label, onGo) {
    if (bar) return;
    css();
    bar = document.createElement('div');
    bar.className = 'bcm-inst notranslate';
    bar.setAttribute('translate', 'no');
    bar.innerHTML = '<button type="button" class="go"><img src="icon-192.png" alt=""><span></span></button><button type="button" class="no" aria-label="Isira">✕</button>';
    bar.querySelector('span').textContent = label;
    bar.querySelector('.go').addEventListener('click', onGo);
    bar.querySelector('.no').addEventListener('click', function () {
      bar.remove(); try { sessionStorage.setItem('bcmInstallHide', '1'); } catch (e) {}
    });
    document.body.appendChild(bar);
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    show('I-install ang BCM Handbook', function () {
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; if (bar) { bar.remove(); bar = null; } });
    });
  });
  window.addEventListener('appinstalled', function () { if (bar) { bar.remove(); bar = null; } });
  if (ios) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        show('Ibutang sa Home Screen', function () {
          var o = document.createElement('div');
          o.className = 'bcm-ios notranslate';
          o.setAttribute('translate', 'no');
          o.innerHTML = '<div>Sa <b>Safari</b>: i-tap ang <b>Share</b> (square nga naay arrow paingon sa taas), dayon pilia ang <b>“Add to Home Screen”</b>.<br><button type="button">Okay</button></div>';
          o.addEventListener('click', function () { o.remove(); });
          document.body.appendChild(o);
        });
      }, 1500);
    });
  }
})();
