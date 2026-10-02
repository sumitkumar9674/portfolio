// ------------------------------------------------------------
// App
// ------------------------------------------------------------
// Application entry point.
// The splash screen stays visible while initial resources load.
// ------------------------------------------------------------

import { useEffect, useState } from "react";
import CubeTest from "./pages/CubeTest/CubeTest";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import { preloadSpaceDefender, spaceDefenderReady } from "./components/SpaceDefenderAssets";

function App() {
  const [isBooted, setIsBooted] = useState(false);

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
      <CubeTest />
      {!isBooted && <SplashScreen />}
    </>
  );
}

export default App;
