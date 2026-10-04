import "./HomeScreen.css";

import flatLogo from "../../assets/logo/flat-logo.png";
import ContactSection from "../../components/ContactSection/ContactSection";
import DecodeText from "../../components/DecodeText/DecodeText";
import DesignationText from "../../components/DesignationText/DesignationText";
import NeonFrame from "../../components/NeonFrame";
import NeonText from "../../components/NeonText";
import ProfilePhoto from "../../components/ProfilePhoto";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { siteContent } from "../../content/siteContent";

type HomeScreenProps = {
  cubeSize: number;
  isActive: boolean;
  isFirstOpen: boolean;
  presentation?: "cube" | "vertical";
};

export default function HomeScreen({
  cubeSize,
  isActive,
  isFirstOpen,
  presentation = "cube",
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
        <header className="homeScreenHeader" aria-label={siteContent.brand.name}>
          <span className="homeHeaderLabel">{siteContent.home.headerLabel}</span>
          <img className="homeLogo" src={flatLogo} alt={siteContent.brand.name} />
        </header>

        <main className="homeScreenMain">
          <section className="homeProfileContainer" aria-label={siteContent.home.introductionLabel}>
            <div className="homeProfileFrame">
              <NeonFrame
                width="100%"
                height="100%"
                borderColor="color-mix(in srgb, var(--color-profile-frame) 67.0588%, transparent)"
                cornerColor="color-mix(in srgb, var(--color-profile-frame) 47.451%, transparent)"
                cornerRadius={profileCornerRadius}
                padding={0}
              >
                <ProfilePhoto size="100%" isActive={isActive} />
              </NeonFrame>
            </div>

            <div className="homeProfileInfo">
              <span className="homeIdentityEyebrow">{siteContent.home.founderPrefix}{siteContent.brand.name.toUpperCase()}</span>
              <div className="homeProfileName">
                {isFirstOpen ? (
                  <NeonText
                    text={siteContent.home.name}
                    isActive={isActive}
                    fontSize="6.5cqw"
                    textColor="var(--color-text-primary)"
                    fontFamily="array"
                  />
                ) : (
                  <span className="homeProfileNameStatic">
                    {siteContent.home.name}
                  </span>
                )}
              </div>
              <DesignationText
                designations={siteContent.home.designations}
                fontSize={presentation === "vertical" ? "0.8rem" : "2.2cqw"}
              />
            </div>
            <div className="homePitch">
              <h1 id="home-title">{siteContent.home.headline}</h1>
              <div className="homeIntroductionCopy">
                {isFirstOpen ? (
                  <DecodeText
                    text={siteContent.home.introduction}
                    fontSize={presentation === "vertical" ? "0.85rem" : "1.8cqw"}
                    padding="0"
                    wrap
                  />
                ) : (
                  <p>{siteContent.home.introduction}</p>
                )}
              </div>
            </div>
          </section>

          <section className="homeCapabilities" aria-labelledby="home-capabilities-title">
            <header className="homeCapabilitiesHeader">
              <h2 id="home-capabilities-title">{siteContent.home.capabilitiesTitle}</h2>
              <span>{siteContent.home.capabilitiesFlow}</span>
            </header>
            <div className="homeCapabilityGrid">
              {siteContent.home.capabilities.map((capability) => (
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

          <footer className="homeContactContainer" aria-label={siteContent.home.contactLabel}>
            <div className="homeContactHeading">
              <span>{siteContent.home.contactQuestion}</span>
              <span className="homeContactPrompt">{siteContent.home.contactPrompt} <b aria-hidden="true">↓</b></span>
            </div>
            <ContactSection cubeSize={cubeSize} variant="compact" />
          </footer>
          <SocialLinks cubeSize={cubeSize} />
        </main>
      </div>
    </section>
  );
}
