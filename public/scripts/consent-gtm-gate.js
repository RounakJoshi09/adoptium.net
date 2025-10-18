(function(){
  var GTM_ID = (function(){
    try {
      var s = document.currentScript || (function(){
        var scripts = document.getElementsByTagName('script');
        for (var i=scripts.length-1;i>=0;i--) {
          if (/\/scripts\/consent-gtm-gate\.js(?:$|\?)/.test(scripts[i].src)) return scripts[i];
        }
        return null;
      })();
      if (s && s.dataset && s.dataset.gtmId) return s.dataset.gtmId;
    } catch(e) {}
    return (window.__GTM_ID || 'GTM-5WLCZXC');
  })();
  var debug = /[?&]consentDebug=1/.test(location.search);

  function log(){ if (debug && typeof console !== 'undefined') { console.log.apply(console, arguments); } }
  function gtag(){ (window.dataLayer = window.dataLayer || []).push(arguments); }

  function readConsentStatus(){
    try {
      var parts = document.cookie.split('; ');
      for (var i=0;i<parts.length;i++){
        var p = parts[i].split('='), k = decodeURIComponent(p[0]||''), v = decodeURIComponent(p.slice(1).join('=')||'');
        if (/^(cookieconsent_status|consent_status|eclipse_cookieconsent_status|eclipse-consent-status)$/.test(k)) {
          return (v||'').trim().toLowerCase();
        }
      }
    } catch(e) {}
    return '';
  }
  function isAllowed(v){
    v = (v||'').toString().trim().toLowerCase();
    return v === 'allow' || v === 'allowed' || v === 'accept' || v === 'accepted' || v === 'granted' || v === 'true' || v === 'yes' || v === 'opted-in';
  }
  function hasConsent(){ return isAllowed(readConsentStatus()); }

  var inserted = false;
  function loadGTM(){
    if (inserted) return; inserted = true;
    var f = document.getElementsByTagName('script')[0];
    var j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    j.onload = function(){ log('[consent] GTM script loaded'); };
    j.onerror = function(){ log('[consent] GTM script failed to load (possibly blocked)'); };
    (f && f.parentNode ? f.parentNode : document.head).insertBefore(j, f || null);
    // After acceptance, update Consent Mode to granted
    gtag('consent','update',{
      ad_storage:'granted',
      analytics_storage:'granted',
      functionality_storage:'granted',
      personalization_storage:'granted',
      security_storage:'granted'
    });
    log('[consent] Consent updated to granted');
  }

  // Initial gate: if already allowed (e.g., returning visitor), load immediately; else poll briefly
  if (hasConsent()) {
    loadGTM();
  } else {
    var tries = 0;
    var interval = setInterval(function(){
      if (hasConsent()) { clearInterval(interval); loadGTM(); }
      else if (++tries > 120) { clearInterval(interval); }
    }, 500);
  }

  // Event-driven revoke handling (avoid polling)
  var lastStatus = readConsentStatus();
  function checkAndMaybeDowngrade(){
    try {
      var current = readConsentStatus();
      if (inserted && isAllowed(lastStatus) && !isAllowed(current)) {
        gtag('consent','update',{
          ad_storage:'denied',
          analytics_storage:'denied',
          functionality_storage:'denied',
          personalization_storage:'denied',
          security_storage:'granted'
        });
        log('[consent] downgraded to denied after revoke');
      }
      lastStatus = current;
    } catch(e) {}
  }

  document.addEventListener('click', function(e){
    try {
      var t = e.target || e.srcElement;
      if (!t) return;
      var cls = (t.className && t.className.baseVal) ? t.className.baseVal : t.className; // handle SVG/baseVal
      var text = (t.textContent || '').toLowerCase();
      var looksLikeRevoke = false;
      if (typeof cls === 'string' && /(cc-deny|cc-reject|cc-dismiss|cc-save|cc-revoke|cookie.*(deny|reject|save|revoke))/i.test(cls)) looksLikeRevoke = true;
      if (!looksLikeRevoke && /\b(deny|decline|reject|save|revoke)\b/i.test(text)) looksLikeRevoke = true;
      if (looksLikeRevoke) setTimeout(checkAndMaybeDowngrade, 200);
    } catch(e) {}
  }, true);

  try { window.addEventListener('cookieconsent_statuschange', function(){ setTimeout(checkAndMaybeDowngrade, 0); }); } catch(e) {}
  try { window.addEventListener('cookieconsent_preferences_updated', function(){ setTimeout(checkAndMaybeDowngrade, 0); }); } catch(e) {}
})();
