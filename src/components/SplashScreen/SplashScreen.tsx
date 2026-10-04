// ------------------------------------------------------------
// SplashScreen
// ------------------------------------------------------------
// Simple full-screen loading screen shown while the application
// prepares its initial resources.
// ------------------------------------------------------------

import "./SplashScreen.css";
import { siteContent } from "../../content/siteContent";

export default function SplashScreen() {
  return (
    <div className="splashScreen" role="status" aria-live="polite">
      <div className="splashScreenText">
        <span>{siteContent.brand.name.toUpperCase()}{siteContent.splash.titleSuffix}</span>
        <strong>{siteContent.splash.loading}</strong>
        <i aria-hidden="true" />
      </div>
    </div>
  );
}
