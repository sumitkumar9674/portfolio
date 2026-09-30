import "./HomeScreen.css";

import flatLogo from "../../assets/logo/flat-logo.png";
import ContactSection from "../../components/ContactSection/ContactSection";
import DecodeText from "../../components/DecodeText/DecodeText";
import DesignationText from "../../components/DesignationText/DesignationText";
import NeonFrame from "../../components/NeonFrame";
import NeonText from "../../components/NeonText";
import ProfilePhoto from "../../components/ProfilePhoto";
import SocialLinks from "../../components/SocialLinks/SocialLinks";

type HomeScreenProps = {
  cubeSize: number;
  isActive: boolean;
  isFirstOpen: boolean;
};

const capabilities = [
  {
    number: "01",
    title: "Product interfaces",
    description: "Clear flows with thoughtful visual detail.",
  },
  {
    number: "02",
    title: "Web + mobile",
    description: "Useful experiences on every screen.",
  },
  {
    number: "03",
    title: "Custom software",
    description: "Tools and systems shaped to fit.",
  },
  {
    number: "04",
    title: "Interactive experiences",
    description: "Distinctive moments with depth and purpose.",
  },
];

const introduction =
  "We turn ambitious ideas into polished digital products—from clear interfaces and mobile experiences to custom tools and interactive systems.";

export default function HomeScreen({
  cubeSize,
  isActive,
  isFirstOpen,
}: HomeScreenProps) {
  const profilePhotoSize = cubeSize * 0.29;
  const profileCornerRadius = Math.min(profilePhotoSize * 0.06, 18);

  return (
    <section
      className="homeScreen"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-labelledby="home-title"
      aria-hidden={!isActive}
      inert={!isActive}
      style={{ "--cube-size": `${cubeSize}px` } as React.CSSProperties}
    >
      <div className="homeScreen3DLayer" aria-hidden="true" />

      <div className="homeScreenContent">
        <header className="homeScreenHeader" aria-label="StickForYou">
          <span className="homeHeaderLabel">DIGITAL PRODUCTS · MADE WITH CARE</span>
          <img className="homeLogo" src={flatLogo} alt="StickForYou" />
        </header>

        <main className="homeScreenMain">
          <section className="homeProfileContainer" aria-label="Introduction">
            <div className="homeProfileFrame">
              <NeonFrame
                width="100%"
                height="100%"
                borderColor="#ddddddab"
                cornerColor="#dddddd79"
                cornerRadius={profileCornerRadius}
                padding={0}
              >
                <ProfilePhoto size="100%" isActive={isActive} />
              </NeonFrame>
            </div>

            <div className="homeProfileInfo">
              <span className="homeIdentityEyebrow">FOUNDER · STICKFORYOU</span>
              <div className="homeProfileName">
                {isFirstOpen ? (
                  <NeonText
                    text="Sumit Kumar"
                    isActive={isActive}
                    fontSize="6.5cqw"
                    textColor="#f1f0e8"
                    fontFamily="array"
                  />
                ) : (
                  <span className="homeProfileNameStatic">
                    Sumit Kumar
                  </span>
                )}
              </div>
              <DesignationText
                designations={[
                  "Product designer & developer",
                  "Interactive experience builder",
                  "Software product creator",
                ]}
                fontSize="2.2cqw"
              />
            </div>
            <div className="homePitch">
              <h1 id="home-title">Thoughtful software, made for people.</h1>
              <div className="homeIntroductionCopy">
                {isFirstOpen ? (
                  <DecodeText
                    text={introduction}
                    fontSize="1.8cqw"
                    padding="0"
                    wrap
                  />
                ) : (
                  <p>{introduction}</p>
                )}
              </div>
            </div>
          </section>

          <section className="homeCapabilities" aria-labelledby="home-capabilities-title">
            <header className="homeCapabilitiesHeader">
              <h2 id="home-capabilities-title">WHAT WE CAN BUILD</h2>
              <span>DESIGN → PRODUCT → SYSTEM</span>
            </header>
            <div className="homeCapabilityGrid">
              {capabilities.map((capability) => (
                <article className="homeCapability" key={capability.number}>
                  <span className="homeCapabilityNumber">{capability.number}</span>
                  <div>
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                  </div>
                  <span className="homeCapabilityArrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </section>

          <footer className="homeContactContainer" aria-label="Contact information">
            <div className="homeContactHeading">
              <span>HAVE SOMETHING IN MIND?</span>
              <span className="homeContactPrompt">LET’S TALK <b aria-hidden="true">↓</b></span>
            </div>
            <ContactSection cubeSize={cubeSize} variant="compact" />
          </footer>
          <SocialLinks cubeSize={cubeSize} />
        </main>
      </div>
    </section>
  );
}
