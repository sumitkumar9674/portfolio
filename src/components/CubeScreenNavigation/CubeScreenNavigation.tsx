// ------------------------------------------------------------
// CubeScreenNavigation
// ------------------------------------------------------------
// Displays the navigation buttons beside the 3D cube.
//
// This component does NOT know how the cube moves.
// It only reports which screen the user selected.
// ------------------------------------------------------------

import "./CubeScreenNavigation.css";

// Available screens that can be requested from the navigation dock.
type ScreenId = "home" | "projects" | "skills" | "about" | "blog" | "contact";

// Props received from the main CubeTest controller.
type CubeScreenNavigationProps = {
  // Called when the user selects a screen.
  onNavigate: (screen: ScreenId) => void;
};

export default function CubeScreenNavigation({
  onNavigate,
}: CubeScreenNavigationProps) {
  return (
    <div className="cubeScreenNavigation">
      {/* Navigate directly to the HOME screen. */}
      <button onClick={() => onNavigate("home")}>HOME</button>

      {/* Navigate directly to the PROJECTS screen. */}
      <button onClick={() => onNavigate("projects")}>PROJECTS</button>

      {/* Navigate directly to the SKILLS screen. */}
      <button onClick={() => onNavigate("skills")}>SKILLS</button>

      {/* Navigate directly to the ABOUT screen. */}
      <button onClick={() => onNavigate("about")}>ABOUT</button>

      {/* Navigate directly to the BLOG screen. */}
      <button onClick={() => onNavigate("blog")}>BLOG</button>

      {/* Navigate directly to the CONTACT . */}
      <button onClick={() => onNavigate("contact")}>CONTACT</button>
    </div>
  );
}
