// ------------------------------------------------------------
// SplashScreen
// ------------------------------------------------------------
// Simple full-screen loading screen shown while the application
// prepares its initial resources.
// ------------------------------------------------------------

import "./SplashScreen.css";

export default function SplashScreen() {
  return (
    <div className="splashScreen" role="status" aria-live="polite">
      <div className="splashScreenText">
        <span>STICKFORYOU / DIGITAL PORTFOLIO</span>
        <strong>LOADING</strong>
        <i aria-hidden="true" />
      </div>
    </div>
  );
}
