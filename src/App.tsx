// ------------------------------------------------------------
// App
// ------------------------------------------------------------
// Application entry point.
// The splash screen stays visible while initial resources load.
// ------------------------------------------------------------

import { useEffect, useLayoutEffect, useState } from "react";
import CubeTest from "./pages/CubeTest/CubeTest";
import VerticalPortfolio from "./pages/VerticalPortfolio/VerticalPortfolio";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import { preloadSpaceDefender, spaceDefenderReady } from "./components/SpaceDefenderAssets";

// The module is evaluated once per page load; resizing never reselects a presentation.
const bootPresentation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";

function App() {
  const [isBooted, setIsBooted] = useState(false);

  useLayoutEffect(() => {
    document.documentElement.dataset.presentation = bootPresentation;
    return () => { delete document.documentElement.dataset.presentation; };
  }, []);

  useEffect(() => {
    Promise.all([preloadSpaceDefender(), spaceDefenderReady])
      .then(() => {
        setIsBooted(true);
      })
      .catch((error) => {
        console.error("Failed to preload SpaceDefender:", error);
        setIsBooted(true);
      });
  }, []);

  return (
    <>
      {bootPresentation === "landscape" ? <CubeTest /> : <VerticalPortfolio />}
      {!isBooted && <SplashScreen />}
    </>
  );
}

export default App;
