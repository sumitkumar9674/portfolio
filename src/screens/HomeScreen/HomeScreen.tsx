import { useEffect, useState } from "react";
import "./HomeScreen.css";

import flatLogo from "../../assets/logo/flat-logo.png";
import ProfilePhoto from "../../components/ProfilePhoto";
import DecodeText from "../../components/DecodeText/DecodeText";
import logoBackground from "../../assets/logo/background.png";
import LogoBanner from "../../components/LogoBanner/LogoBanner";
import GitHubActivity from "../../components/GitHubActivity/GitHubActivity";
import DesignationText from "../../components/DesignationText/DesignationText";
import GreetingTime from "../../components/GreetingTime/GreetingTime";
import NeonText from "../../components/NeonText";
import CurrentlyBuilding from "../../components/CurrentlyBuilding/CurrentlyBuilding";
import ContactSection from "../../components/ContactSection/ContactSection";

const projects = [
  {
    name: "Horizon - Productivity App",
    description:
      "A productivity and social accountability application focused on disciplined task execution. Horizon uses tomorrow-only planning and Parkinson's Law to help users commit to a manageable amount of work and complete it consistently. Streaks, progression, and social accountability turn daily execution into a structured and sustainable habit.",
  },
  {
    name: "DesignLab - UI Library",
    description:
      "A reusable UI component library created with React Native and Expo, focused on building clean and practical interface components. Each component is designed as a reusable building block with live previews, documentation, and source examples. The goal is to make experimentation and refinement simple while keeping the final components production ready.",
  },
  {
    name: "Couple Cycle - Social App",
    description:
      "A relationship-focused mobile application built with React Native, Expo, Firebase Authentication, and Firestore. The application combines private communication and shared information into a simple experience designed for couples. Real-time interaction, authentication, and structured data handling form the foundation of the application.",
  },
  {
    name: "Portfolio - 3D Interface",
    description:
      "An interactive portfolio built around a physical 3D cube where each face represents a permanent screen. Navigation rotates the entire cube instead of replacing traditional page content. React, TypeScript, CSS 3D transforms, responsive sizing, reusable components, animations, and live project information come together to make the portfolio itself demonstrate frontend engineering skills.",
  },
  {
    name: "AI Learning Projects",
    description:
      "A collection of projects focused on strengthening practical knowledge in Python, data structures, machine learning, and artificial intelligence. The work combines smaller experiments with larger applications to turn theoretical concepts into working software. The focus is on understanding the underlying ideas while gradually building more capable and useful systems.",
  },
];

type HomeScreenProps = {
  cubeSize: number;
  isActive: boolean;
};

export default function HomeScreen({
  cubeSize: _cubeSize,
  isActive,
}: HomeScreenProps) {
  const [homeRenderKey, setHomeRenderKey] = useState(0);

  /*
   * Give the initial Home render one browser frame to settle,
   * then remount the Home content once.
   */
  useEffect(() => {
    if (!isActive) return;

    const frame = requestAnimationFrame(() => {
      setHomeRenderKey((key) => key + 1);
    });

    return () => cancelAnimationFrame(frame);
  }, [isActive]);

  return (
    <div
      className="homeScreen"
      style={
        {
          "--cube-size": `${_cubeSize}px`,
        } as React.CSSProperties
      }
    >
      <div className="homeScreen3DLayer">
        {/* Future 3D objects go here. */}
      </div>

      <div className="homeScreenContent" key={homeRenderKey}>
        <header className="homeScreenHeader">
          <LogoBanner
            image={flatLogo}
            backgroundImage={logoBackground}
            height="100%"
          />
        </header>

        <main className="homeScreenMain">
          <div className="homeProfileContainer">
            <div
              className="homeProfileSection"
              style={
                {
                  "--profile-photo-size": `${_cubeSize * 0.22}px`,
                } as React.CSSProperties
              }
            >
              <div className="homeProfileFrame">
                <ProfilePhoto size={_cubeSize * 0.22} />
              </div>

              <div className="homeProfileInfo">
                <div className="homeProfileTopRow">
                  <div className="homeProfileName">
                    <NeonText
                      text="Sumit Kumar"
                      fontSize={`${_cubeSize * 0.041}px`}
                      textColor="#ffffff92"
                    />
                  </div>

                  <div className="homeProfileDesignation">
                    <DesignationText
                      designations={[
                        "Software Developer",
                        "UI/UX Developer",
                        "Full Stack Engineer",
                      ]}
                      isActive={isActive}
                      fontSize={`${_cubeSize * 0.023}px`}
                      padding="0 4px"
                    />
                  </div>
                </div>

                <div className="homeGreetingSection">
                  <GreetingTime cubeSize={_cubeSize} />
                </div>

                <div className="homeProfileDescription">
                  <DecodeText
                    text="I build interactive, user-focused applications with React, TypeScript, React Native, and Firebase. I enjoy turning ideas into clean, practical experiences while continuously strengthening my skills in software engineering, DSA, and AI/ML."
                    fontSize={`${_cubeSize * 0.023}px`}
                    padding="0"
                    wrap
                  />
                </div>
              </div>
            </div>
          </div>

          <CurrentlyBuilding
            projects={projects}
            isActive={isActive}
            cubeSize={_cubeSize}
          />

          <div className="homeGitHubContainer">
            <GitHubActivity _cubeSize={_cubeSize} />
          </div>

          <div className="homeContactContainer">
            <ContactSection cubeSize={_cubeSize} />
          </div>
        </main>
      </div>
    </div>
  );
}
