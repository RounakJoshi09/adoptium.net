(function(){
  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    // Set Google Consent Mode defaults to denied until explicit consent
    gtag('consent','default',{
      ad_storage:'denied',
      analytics_storage:'denied',
      functionality_storage:'denied',
      personalization_storage:'denied',
      security_storage:'granted'
    });
  } catch(e) {
    // no-op
  }
})();
