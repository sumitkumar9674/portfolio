import SpaceDefender from "../../components/SpaceDefender";
import "./SpaceDefenderScreen.css";

type SpaceDefenderScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
  isFirstOpen: boolean;
};

export default function SpaceDefenderScreen({
  isActive,
  hasBeenActivated,
  isFirstOpen,
}: SpaceDefenderScreenProps) {
  return (
    <div
      className="spaceDefenderScreen"
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
