// ------------------------------------------------------------
// App
// ------------------------------------------------------------
// Application entry point.
// The splash screen stays visible while initial resources load.
// ------------------------------------------------------------

import { useEffect, useState } from "react";
import CubeTest from "./pages/CubeTest/CubeTest";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import { preloadSpaceDefender } from "./components/SpaceDefender";

function App() {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    preloadSpaceDefender()
      .then(() => {
        setIsBooted(true);
      })
      .catch((error) => {
        console.error("Failed to preload SpaceDefender:", error);
        setIsBooted(true);
      });
  }, []);

  if (!isBooted) {
    return <SplashScreen />;
  }

  return <CubeTest />;
}

export default App;
