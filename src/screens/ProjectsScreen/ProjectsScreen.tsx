// ------------------------------------------------------------
// ProjectsScreen
// ------------------------------------------------------------
// Content displayed on the PROJECTS face of the 3D cube.
//
// This component is independent from the cube controller.
// ------------------------------------------------------------

import "./ProjectsScreen.css";
import DecodeText from "../../components/DecodeText/DecodeText";
import NeonText from "../../components/NeonText";

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
      data-first-open={isFirstOpen}
      data-has-been-activated={hasBeenActivated}
      aria-hidden={!isActive}
      inert={!isActive}
    >
      <div className="projectsEyebrow">A small studio for thoughtful software</div>

      <div className="projectsBox projectsIdentity">
        {isFirstOpen ? <NeonText
          text="STICKFORYOU"
          isActive={isActive}
          fontFamily="array"
          fontSize="8cqw"
          textAlign="right"
          textColor="#ffffff"
          backgroundColor="transparent"
          initialDelay={300}
          flickerDuration={1200}
          flickerSpeed={60}
        /> : <span className="projectsStaticText">STICKFORYOU</span>}
      </div>

      <div className="projectsBox projectsTagline">
        {isFirstOpen ? <NeonText
          text="SIMPLE IS A FEATURE."
          isActive={isActive}
          fontFamily="kola"
          fontSize="5cqw"
          textAlign="left"
          textColor="#b9d6d6"
          backgroundColor="transparent"
          initialDelay={600}
          flickerDuration={1200}
          flickerSpeed={60}
        /> : <span className="projectsStaticText projectsStaticTagline">SIMPLE IS A FEATURE.</span>}
      </div>

      <div className="projectsBox projectsDescription">
        {isFirstOpen ? <DecodeText
          text={`StickForYou is a UI/UX and system design company focused on making
digital experiences simple to use, thoughtfully designed, and built to grow.

We work alongside our customers to solve what matters today while creating
systems that are ready for what comes next. As they grow, we grow with them.`}
          fontFamily="kola"
          fontSize="2.5cqw"
          padding="0"
          wrap={true}
        /> : <p className="projectsDescriptionCopy">StickForYou is a UI/UX and system design company focused on making digital experiences simple to use, thoughtfully designed, and built to grow. We work alongside our customers to solve what matters today while creating systems that are ready for what comes next. As they grow, we grow with them.</p>}
      </div>
    </div>
  );
}
