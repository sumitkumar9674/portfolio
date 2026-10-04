import "./CubeScreenNavigation.css";
import { useEffect, useState } from "react";
import { siteContent } from "../../content/siteContent";

// ------------------------------------------------------------
// Screen names
// ------------------------------------------------------------

type ScreenId =
  | "home"
  | "projects"
  | "skills"
  | "blog"
  | "contact"
  | "spaceDefender";

// ------------------------------------------------------------
// Component props
// ------------------------------------------------------------

type CubeScreenNavigationProps = {
  onNavigate: (screen: ScreenId) => void;
  activeScreen: ScreenId;
};

// ------------------------------------------------------------
// Navigation component
// ------------------------------------------------------------

export default function CubeScreenNavigation({
  onNavigate,
  activeScreen,
}: CubeScreenNavigationProps) {
  // ----------------------------------------------------------
  // Determine whether the current browser is portrait.
  //
  // Portrait:
  // height >= width
  //
  // Landscape:
  // width > height
  // ----------------------------------------------------------

  const [isPortrait, setIsPortrait] = useState(
    () => window.innerWidth <= window.innerHeight,
  );

  // ----------------------------------------------------------
  // Watch the browser size.
  //
  // This lets the navigation switch position immediately
  // when the browser changes from landscape to portrait
  // or vice versa.
  // ----------------------------------------------------------

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerWidth <= window.innerHeight);
    };

    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  // ----------------------------------------------------------
  // Navigation
  // ----------------------------------------------------------

  return (
    <div
      aria-label={siteContent.navigation.cubeLabel}
      role="navigation"
      className={`cubeScreenNavigation ${
        isPortrait
          ? "cubeScreenNavigationPortrait"
          : "cubeScreenNavigationLandscape"
      }`}
    >
      <button
        aria-current={activeScreen === "home" ? "page" : undefined}
        onClick={() => onNavigate("home")}
      >
        {siteContent.navigation.home}
      </button>

      <button
        aria-current={activeScreen === "projects" ? "page" : undefined}
        onClick={() => onNavigate("projects")}
      >
        {siteContent.navigation.projects}
      </button>

      <button
        aria-current={activeScreen === "skills" ? "page" : undefined}
        onClick={() => onNavigate("skills")}
      >
        {siteContent.navigation.forge}
      </button>

      <button
        aria-current={activeScreen === "blog" ? "page" : undefined}
        onClick={() => onNavigate("blog")}
      >
        {siteContent.navigation.blog}
      </button>

      <button
        aria-current={activeScreen === "contact" ? "page" : undefined}
        onClick={() => onNavigate("contact")}
      >
        {siteContent.navigation.contact}
      </button>

      <button
        aria-current={activeScreen === "spaceDefender" ? "page" : undefined}
        onClick={() => onNavigate("spaceDefender")}
      >
        {siteContent.navigation.spaceDefender}
      </button>
    </div>
  );
}
