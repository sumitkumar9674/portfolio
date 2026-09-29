import SpaceDefender from "../../components/SpaceDefender";
import "./ProjectsScreen.css";

type ProjectsScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
  isFirstOpen: boolean;
};

export default function ProjectsScreen({
  isActive,
  hasBeenActivated,
  isFirstOpen,
}: ProjectsScreenProps) {
  return (
    <div
      className="projectsScreen"
      data-active={isActive}
      data-has-been-activated={hasBeenActivated}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <SpaceDefender isOpen={isActive} />
    </div>
  );
}
