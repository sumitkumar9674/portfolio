import { useLayoutEffect, useRef, useState } from "react";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import ProjectsScreen from "../../screens/ProjectsScreen/ProjectsScreen";
import SkillsScreen from "../../screens/SkillsScreen/SkillsScreen";
import BlogScreen from "../../screens/BlogScreen/BlogScreen";
import ContactScreen from "../../screens/ContactScreen/ContactScreen";
import SpaceDefenderScreen from "../../screens/SpaceDefenderScreen/SpaceDefenderScreen";
import { useSectionVisibility } from "../../hooks/useSectionVisibility";
import { siteContent } from "../../content/siteContent";
import "./VerticalPortfolio.css";

const sections = [
  ["home", siteContent.navigation.home],
  ["projects", siteContent.navigation.projects],
  ["forge", siteContent.navigation.forge],
  ["blog", siteContent.navigation.blog],
  ["contact", siteContent.navigation.contact],
  ["space-defender", siteContent.navigation.spaceDefender],
] as const;

export default function VerticalPortfolio() {
  const homeRef = useRef<HTMLElement>(null);
  const [homeWidth, setHomeWidth] = useState(0);
  const [projectsRef, projectsVisible] = useSectionVisibility<HTMLElement>(0.35);
  const [blogRef, blogVisible] = useSectionVisibility<HTMLElement>(0.35);
  const [defenderRef, defenderVisible] = useSectionVisibility<HTMLElement>(0.55);

  // Home's frame and contact graphics still need their actual rendered width.
  useLayoutEffect(() => {
    const element = homeRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setHomeWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="verticalPortfolio">
      <nav className="verticalNavigation" aria-label={siteContent.navigation.verticalLabel}>
        <div className="verticalNavigationItems">
          {sections.map(([id, label]) => <a href={`#vertical-${id}`} key={id}>{label}</a>)}
        </div>
      </nav>

      <main className="verticalPortfolioMain">
        <section className="verticalSection verticalHome" id="vertical-home" ref={homeRef} aria-label={siteContent.navigation.sectionLabels.home}>
          <HomeScreen cubeSize={homeWidth} isActive isFirstOpen presentation="vertical" />
        </section>
        <section className="verticalSection verticalProjects" id="vertical-projects" ref={projectsRef} aria-label={siteContent.navigation.sectionLabels.projects}>
          <ProjectsScreen isActive={projectsVisible} hasBeenActivated isFirstOpen={false} />
        </section>
        <section className="verticalSection verticalForge" id="vertical-forge" aria-label={siteContent.navigation.sectionLabels.forge}>
          <SkillsScreen isActive isFirstOpen={false} />
        </section>
        <section className="verticalSection verticalBlog" id="vertical-blog" ref={blogRef} aria-label={siteContent.navigation.sectionLabels.blog}>
          <BlogScreen isActive={blogVisible} isFirstOpen={false} />
        </section>
        <section className="verticalSection verticalContact" id="vertical-contact" aria-label={siteContent.navigation.sectionLabels.contact}>
          <ContactScreen isActive isFirstOpen={false} />
        </section>
        <section className="verticalSection verticalDefender" id="vertical-space-defender" ref={defenderRef} aria-label={siteContent.navigation.sectionLabels.spaceDefender}>
          <SpaceDefenderScreen isActive={defenderVisible} hasBeenActivated isFirstOpen={false} />
        </section>
      </main>
    </div>
  );
}
