import "./SkillsScreen.css";

type SkillsScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

const skillGroups = [
  { label: "INTERFACE", skills: ["React", "TypeScript", "UI / UX"] },
  { label: "PRODUCT", skills: ["React Native", "Expo", "Firebase"] },
  { label: "FOUNDATIONS", skills: ["JavaScript", "Python", "DSA · AI / ML"] },
];

export default function SkillsScreen({ isActive, isFirstOpen }: SkillsScreenProps) {
  return (
    <section
      className="skillsScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="skills-title"
    >
      <header className="screenHeading">
        <span className="screenEyebrow">TOOLS & PRACTICE · 03</span>
        <h1 id="skills-title">Built to make ideas useful.</h1>
        <p>A growing toolkit for shaping clear interfaces and dependable products.</p>
      </header>
      <div className="skillsGrid">
        {skillGroups.map((group, index) => (
          <section className="skillGroup" key={group.label}>
            <span className="skillIndex">0{index + 1}</span>
            <div>
              <h2>{group.label}</h2>
              <ul>
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          </section>
        ))}
      </div>
      <footer className="screenFooter"><span>ALWAYS LEARNING</span><span className="statusDot" />
        Currently exploring thoughtful systems and AI.</footer>
    </section>
  );
}
