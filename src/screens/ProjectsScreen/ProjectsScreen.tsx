import "./ProjectsScreen.css";

type ProjectsScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
  isFirstOpen: boolean;
};

type WorkingProject = {
  title: string;
  description: string;
  status: string;
};

type LiveProject = {
  title: string;
  description: string;
  image: string;
  url: string;
  tags?: string[];
};

// Keep these lists as the source of truth for the Projects face.
const currentlyWorking: WorkingProject[] = [
  {
    title: "Portfolio Cube",
    description:
      "A six-face portfolio built around cube-relative layouts, 3D navigation, and interactive screens.",
    status: "IN PROGRESS",
  },
  {
    title: "Horizon",
    description:
      "A productivity app exploring structured planning, streaks, and focused daily execution.",
    status: "IN PROGRESS",
  },
];

// Add one entry per shipped project. Its image and URL are rendered from this data.
const liveProjects: LiveProject[] = [
  {
    title: "Project Alpha",
    description:
      "Temporary project data used to test the live-project card layout.",
    image: "",
    url: "",
    tags: ["React", "TypeScript"],
  },
  {
    title: "Project Beta",
    description:
      "A second temporary project used to test how multiple cards fit inside the grid.",
    image: "",
    url: "",
    tags: ["React Native", "Firebase"],
  },
  {
    title: "Project Gamma",
    description:
      "Temporary content for testing project-card sizing and internal scrolling.",
    image: "",
    url: "",
    tags: ["Node.js", "MongoDB"],
  },
  {
    title: "Project Delta",
    description:
      "Another placeholder entry for checking how the project list behaves as it grows.",
    image: "",
    url: "",
    tags: ["Express", "TypeScript"],
  },
];

export default function ProjectsScreen({
  isActive,
  hasBeenActivated,
  isFirstOpen,
}: ProjectsScreenProps) {
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
        <div className="projectsMeta">
          <span>
            PROJECTS <span aria-hidden="true">/</span> 02
          </span>

          <span>BUILD LOG · SELECTED WORK</span>
        </div>

        <div className="projectsIntroduction">
          <h1 id="projects-title">What I’m building.</h1>

          <p>Current work, then the projects ready to explore.</p>
        </div>
      </header>

      <section
        className="projectsWorking"
        aria-labelledby="projects-working-title"
      >
        <div className="projectsSectionHeading">
          <h2 id="projects-working-title">CURRENTLY WORKING</h2>

          <span>{String(currentlyWorking.length).padStart(2, "0")} ACTIVE</span>
        </div>

        {currentlyWorking.length > 0 ? (
          <div className="projectsWorkingList">
            {currentlyWorking.map((project) => (
              <article className="projectsWorkingItem" key={project.title}>
                <div className="projectsWorkingCopy">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <span className="projectsStatus">
                  <span aria-hidden="true" />
                  {project.status}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="projectsQuietState">
            <p>No active builds listed yet.</p>
          </div>
        )}
      </section>

      <section className="projectsLive" aria-labelledby="projects-live-title">
        <div className="projectsSectionHeading">
          <h2 id="projects-live-title">LIVE PROJECTS</h2>

          <span>{String(liveProjects.length).padStart(2, "0")} RELEASED</span>
        </div>

        {liveProjects.length > 0 ? (
          <div className="projectsLiveGrid">
            {liveProjects.map((project) => {
              const projectContent = (
                <>
                  <img
                    className="projectsLiveImage"
                    src={project.image}
                    alt=""
                  />

                  <div className="projectsLiveCopy">
                    <div className="projectsLiveTitleRow">
                      <h3>{project.title}</h3>
                      <span aria-hidden="true">↗</span>
                    </div>

                    <p>{project.description}</p>

                    {project.tags && project.tags.length > 0 && (
                      <ul className="projectsTags" aria-label="Technologies">
                        {project.tags.map((tag) => (
                          <li key={tag}>{tag}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              );

              return project.url ? (
                <a
                  className="projectsLiveCard"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={project.title}
                >
                  {projectContent}
                </a>
              ) : (
                <article className="projectsLiveCard" key={project.title}>
                  {projectContent}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="projectsEmptyState">
            <span className="projectsEmptyMark" aria-hidden="true">
              0 / 00
            </span>

            <h3>Nothing published here yet.</h3>

            <p>
              Finished projects will appear here when they’re ready to share.
            </p>
          </div>
        )}
      </section>

      <footer className="projectsFooter">
        <span>
          BUILD <b aria-hidden="true">/</b> SHIP <b aria-hidden="true">/</b>{" "}
          ITERATE
        </span>

        <span>WORK IN MOTION</span>
      </footer>
    </section>
  );
}
