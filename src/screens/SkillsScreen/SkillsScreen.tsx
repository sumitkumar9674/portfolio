import GitHubActivity from "../../components/GitHubActivity/GitHubActivity";
import "./SkillsScreen.css";

type SkillsScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

const capabilities = [
  {
    number: "01",
    title: "WEB EXPERIENCES",
    description: "Responsive interfaces, interactive sites and polished product flows.",
    tools: "React · TypeScript · JavaScript · UI / UX",
  },
  {
    number: "02",
    title: "MOBILE APPLICATIONS",
    description: "Cross-platform apps with sign-in, connected data and live interactions.",
    tools: "React Native · Expo · Firebase",
  },
  {
    number: "03",
    title: "BACKEND SYSTEMS",
    description: "Authentication, persistent data and API-connected product logic.",
    tools: "Firebase Authentication · Firestore",
  },
  {
    number: "04",
    title: "REAL-TIME FEATURES",
    description: "Live application data and synchronized experiences across screens.",
    tools: "Firestore · Firebase",
  },
];

export default function SkillsScreen({ isActive, isFirstOpen }: SkillsScreenProps) {
  return (
    <section
      className="forgeScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="forge-title"
    >
      <header className="forgeHeader">
        <div className="forgeMeta">
          <span>FORGE <span aria-hidden="true">/</span> 03</span>
          <span>ENGINEERING CAPABILITIES</span>
        </div>
        <div className="forgeIntroduction">
          <h1 id="forge-title">What I build.</h1>
          <p>Interfaces, mobile apps, APIs and live features that work together.</p>
        </div>
      </header>

      <section className="forgeCapabilities" aria-labelledby="forge-capabilities-title">
        <div className="forgeSectionHeading">
          <h2 id="forge-capabilities-title">CAPABILITIES</h2>
          <span>DESIGN → APPLICATION → SYSTEM</span>
        </div>
        <div className="forgeCapabilityGrid">
          {capabilities.map((capability) => (
            <article className="forgeCapability" key={capability.number}>
              <div className="forgeCapabilityHeading">
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{capability.description}</p>
              <small>{capability.tools}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="forgeActivity" aria-labelledby="forge-activity-title">
        <div className="forgeSectionHeading">
          <h2 id="forge-activity-title">BUILD ACTIVITY</h2>
          <a
            href="https://github.com/sumitkumar9674"
            target="_blank"
            rel="noopener noreferrer"
          >
            @SUMITKUMAR9674 <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="forgeActivityPanel">
          <div className="forgeActivityLabel">
            <span>GITHUB / CONTRIBUTION LOG</span>
            <span>LAST 12 MONTHS</span>
          </div>
          <GitHubActivity />
        </div>
      </section>

      <footer className="forgeFooter">
        <span>LEARN / BUILD / REPEAT</span>
        <span><span className="forgeStatusDot" aria-hidden="true" /> ALWAYS LEARNING</span>
      </footer>
    </section>
  );
}
