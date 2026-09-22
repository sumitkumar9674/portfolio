import "./HomeScreen.css";
import flatLogo from "../../assets/logo/flat-logo.png";
import ProfilePhoto from "../../components/ProfilePhoto";
import { GitHubCalendar } from "react-github-calendar";
import DecodeText from "../../components/DecodeText/DecodeText";
import logoBackground from "../../assets/logo/background.png";
import LogoBanner from "../../components/LogoBanner/LogoBanner";
import GitHubActivity from "../../components/GitHubActivity/GitHubActivity";

type HomeScreenProps = {
  cubeSize: number;
};

export default function HomeScreen({ cubeSize: _cubeSize }: HomeScreenProps) {
  return (
    <div className="homeScreen">
      {/* ------------------------------------------------
          3D OBJECT LAYER

          This remains empty for now.

          Future 3D objects such as:
          - PC
          - Monitor
          - Phone
          - decorative structures

          will be placed here.
      ------------------------------------------------- */}

      <div className="homeScreen3DLayer">
        {/* Future 3D objects go here. */}
      </div>

      {/* ------------------------------------------------
          NORMAL CONTENT LAYER
      ------------------------------------------------- */}

      <div className="homeScreenContent">
        {/* ------------------------------------------------
            STICKFORYOU LOGO

            This is the fixed, thin header at the top
            of the Home face.
        ------------------------------------------------- */}

        <header className="homeScreenHeader">
          <LogoBanner
            image={flatLogo}
            backgroundImage={logoBackground}
            height="100%"
          />
        </header>
        <main className="homeScreenMain">
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
              <div className="homeProfileName">
                <DecodeText
                  text="Sumit Kumar"
                  fontSize={`${_cubeSize * 0.041}px`}
                  padding={`${_cubeSize * 0.008}px`}
                />
              </div>{" "}
              <div>Software Developer</div>
              <div>
                I build interactive, user-focused applications with React,
                TypeScript, React Native, and Firebase, while continuously
                strengthening my skills in DSA and AI/ML.
              </div>
            </div>
          </div>
          <div className="homeGreetingSection">
            <div>Good Morning</div>
          </div>
          <div className="homeSkillsSection">
            <div className="homeSkillsHeader">
              <div>Skills</div>
              <div>Languages</div>
            </div>

            <div className="homeSkillsList">
              <div>TypeScript</div>
              <div>JavaScript</div>
              <div>Python</div>
              <div>Java</div>
              <div>SQL</div>
            </div>
          </div>
          <div className="homeCurrentFocusSection">
            <div className="homeCurrentFocusHeader">
              <div>Currently Building</div>
              <div>Horizon</div>
            </div>

            <div className="homeCurrentFocusDescription">
              <div>
                Building Horizon, a productivity and social accountability
                application with daily task management, streak tracking, friend
                relationships, and a timezone-aware backend system.
              </div>
            </div>
          </div>
          <div className="homeContactSection">
            <div className="homeContactTitle">
              <div>Contact</div>
            </div>

            <div className="homeContactDetails">
              <div>sumitkumar9674@gmail.com</div>
              <div>9764536604</div>
            </div>

            <div className="homeContactSocials">
              <div>Instagram</div>
              <div>Twitter</div>
              <div>Reddit</div>
              <div>GitHub</div>
              <div>LinkedIn</div>
            </div>
          </div>
          <GitHubActivity _cubeSize={_cubeSize} />
        </main>
      </div>
    </div>
  );
}
