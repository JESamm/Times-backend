import React, { useState, useEffect } from 'react';
import '../styles/install-prompt.css';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(standalone);

    // Check for iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    // Listen for the beforeinstallprompt event
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
      if (!dismissed || Date.now() - dismissedTime > oneWeek) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS prompt if applicable
    if (ios && !standalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed-ios');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      
      if (!dismissed || Date.now() - dismissedTime > oneWeek) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('App installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa-install-dismissed-ios', Date.now().toString());
    } else {
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }
  };

  // Don't show if already installed or prompt not available
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <div className="install-prompt-header">
          <span className="install-prompt-icon">📰</span>
          <button className="install-prompt-close" onClick={handleDismiss}>×</button>
        </div>
        
        <h3>Install TMU TIMES</h3>
        
        {isIOS ? (
          <div className="install-prompt-ios">
            <p>Install this app on your device for quick access:</p>
            <ol>
              <li>Tap the <strong>Share</strong> button <span className="ios-icon">⬆️</span></li>
              <li>Scroll and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>Add</strong> to confirm</li>
            </ol>
          </div>
        ) : (
          <div className="install-prompt-content">
            <p>Get quick access to TMU TIMES with:</p>
            <ul>
              <li>📱 Home screen shortcut</li>
              <li>⚡ Faster loading</li>
              <li>📴 Offline support</li>
              <li>🔔 Push notifications</li>
            </ul>
          </div>
        )}
        
        <div className="install-prompt-actions">
          {!isIOS && (
            <button className="install-btn primary" onClick={handleInstall}>
              Install App
            </button>
          )}
          <button className="install-btn secondary" onClick={handleDismiss}>
            {isIOS ? 'Got it!' : 'Maybe Later'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
