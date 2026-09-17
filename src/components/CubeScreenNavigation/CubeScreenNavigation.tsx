import "./CubeScreenNavigation.css";
import { useEffect, useState } from "react";

// ------------------------------------------------------------
// Screen names
// ------------------------------------------------------------

type ScreenId = "home" | "projects" | "skills" | "about" | "blog" | "contact";

// ------------------------------------------------------------
// Component props
// ------------------------------------------------------------

type CubeScreenNavigationProps = {
  onNavigate: (screen: ScreenId) => void;
};

// ------------------------------------------------------------
// Navigation component
// ------------------------------------------------------------

export default function CubeScreenNavigation({
  onNavigate,
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
      className={`cubeScreenNavigation ${
        isPortrait
          ? "cubeScreenNavigationPortrait"
          : "cubeScreenNavigationLandscape"
      }`}
    >
      <button onClick={() => onNavigate("home")}>HOME</button>

      <button onClick={() => onNavigate("projects")}>PROJECTS</button>

      <button onClick={() => onNavigate("skills")}>SKILLS</button>

      <button onClick={() => onNavigate("about")}>ABOUT</button>

      <button onClick={() => onNavigate("blog")}>BLOG</button>

      <button onClick={() => onNavigate("contact")}>CONTACT</button>
    </div>
  );
}
