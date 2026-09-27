import SpaceDefender from "../../components/SpaceDefender";
import "./ProjectsScreen.css";

type ProjectsScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
};

export default function ProjectsScreen({
  isActive,
  hasBeenActivated,
}: ProjectsScreenProps) {
  return (
    <div
      className="projectsScreen"
      data-active={isActive}
      data-has-been-activated={hasBeenActivated}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <SpaceDefender isOpen={isActive} />
    </div>
  );
}
