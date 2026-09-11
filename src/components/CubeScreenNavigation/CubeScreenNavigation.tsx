import "./CubeScreenNavigation.css";

type ScreenId = "home" | "projects" | "skills" | "about" | "blog" | "contact";

type CubeScreenNavigationProps = {
  onNavigate: (screen: ScreenId) => void;

  // Controls whether the navigation is positioned at HOME
  // or moved to the side for the other cube screens.
  isHome: boolean;
};

export default function CubeScreenNavigation({
  onNavigate,
  isHome,
}: CubeScreenNavigationProps) {
  return (
    <div
      className={`cubeScreenNavigation ${
        isHome ? "cubeScreenNavigationHome" : "cubeScreenNavigationAway"
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
