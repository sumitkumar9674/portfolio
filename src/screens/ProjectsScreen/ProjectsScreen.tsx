import ProjectShowcase from "../../components/ProjectShowcase/ProjectShowcase";
import { currentlyWorking, liveProjects } from "../../data/projects";
import { siteContent } from "../../content/siteContent";
import { useBlogsPage } from "../../hooks/useBlogsPage";
import "./ProjectsScreen.css";

type ProjectsScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
  isFirstOpen: boolean;
};

export default function ProjectsScreen({ isActive, hasBeenActivated, isFirstOpen }: ProjectsScreenProps) {
  const showingBlogs = useBlogsPage();
  const showcaseActive = isActive && !showingBlogs;

  return (
    <section
      className="projectsScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      data-has-been-activated={hasBeenActivated}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="projects-title"
    >
      <header className="projectsHeader">
        <div className="projectsMeta"><span>{siteContent.projects.eyebrow}</span><span>{siteContent.projects.meta}</span></div>
        <div className="projectsIntroduction">
          <h1 id="projects-title">{siteContent.projects.heading}</h1>
          <p>{siteContent.projects.introduction}</p>
        </div>
      </header>

      <ProjectShowcase
        id="projects-working-title"
        title={siteContent.projects.workingTitle}
        category="working"
        projects={currentlyWorking}
        isActive={showcaseActive}
        emptyMessage={siteContent.projects.workingEmpty}
      />
      <ProjectShowcase
        id="projects-live-title"
        title={siteContent.projects.liveTitle}
        category="live"
        projects={liveProjects}
        isActive={showcaseActive}
        emptyMessage={siteContent.projects.liveEmpty}
      />

      <footer className="projectsFooter">
        <span>{siteContent.projects.footerWords[0]} <b aria-hidden="true">/</b> {siteContent.projects.footerWords[1]} <b aria-hidden="true">/</b> {siteContent.projects.footerWords[2]}</span>
        <span>{siteContent.projects.footerNote}</span>
      </footer>
    </section>
  );
}
