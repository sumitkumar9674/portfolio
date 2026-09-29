// ------------------------------------------------------------
// AboutScreen
// ------------------------------------------------------------
// Content displayed on the ABOUT face of the 3D cube.
//
// This component is independent from the cube controller.
// ------------------------------------------------------------

import "./AboutScreen.css";
import DecodeText from "../../components/DecodeText/DecodeText";
import NeonText from "../../components/NeonText";

type AboutScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
};

export default function AboutScreen({
  isActive,
  hasBeenActivated,
}: AboutScreenProps) {
  return (
    <div className="aboutScreen">
      {isActive && hasBeenActivated && (
        <div className="aboutFirstOpenBanner">FIRST OPEN BANNER</div>
      )}

      <div className="aboutBox aboutIdentity">
        <NeonText
          text="STICKFORYOU"
          fontFamily="array"
          fontSize="8cqw"
          textAlign="right"
          textColor="#ffffff"
          backgroundColor="transparent"
          initialDelay={300}
          flickerDuration={1200}
          flickerSpeed={60}
        />
      </div>

      <div className="aboutBox aboutTagline">
        <NeonText
          text="SIMPLE IS A FEATURE."
          fontFamily="kola"
          fontSize="5cqw"
          textAlign="left"
          textColor="#b9d6d6"
          backgroundColor="transparent"
          initialDelay={600}
          flickerDuration={1200}
          flickerSpeed={60}
        />
      </div>

      <div className="aboutBox aboutDescription">
        <DecodeText
          text={`StickForYou is a UI/UX and system design company focused on making
digital experiences simple to use, thoughtfully designed, and built to grow.

We work alongside our customers to solve what matters today while creating
systems that are ready for what comes next. As they grow, we grow with them.`}
          fontFamily="kola"
          fontSize="2.5cqw"
          padding="0"
          wrap={true}
        />
      </div>
    </div>
  );
}
