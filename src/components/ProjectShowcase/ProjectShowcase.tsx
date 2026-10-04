import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Project } from "../../data/projects";
import { siteContent } from "../../content/siteContent";
import "./ProjectShowcase.css";

type ProjectShowcaseProps = {
  projects: Project[];
  isActive: boolean;
  id: string;
  title: string;
  category: "working" | "live";
  emptyMessage: string;
};

const ROTATION_DELAY = 7000;
const TRANSITION_DURATION = 450;
const slots = [-2, -1, 0, 1, 2];
const wrap = (index: number, count: number) => ((index % count) + count) % count;
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function subscribeMotion(onChange: () => void) {
  motionPreference.addEventListener("change", onChange);
  return () => motionPreference.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export default function ProjectShowcase({ projects, isActive, id, title, category, emptyMessage }: ProjectShowcaseProps) {
  const [position, setPosition] = useState(0);
  const [interaction, setInteraction] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => motionPreference.matches);
  const documentVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden);
  const lockedUntil = useRef(0);
  const count = projects.length;
  const currentIndex = count ? wrap(position, count) : 0;
  const rotating = isActive && count > 1 && documentVisible && !paused && !focused && !hovered;

  const move = useCallback((direction: number) => {
    if (count < 2 || performance.now() < lockedUntil.current) return;
    lockedUntil.current = performance.now() + (reducedMotion ? 0 : TRANSITION_DURATION);
    setPosition((previous) => previous + direction);
  }, [count, reducedMotion]);

  function manuallyMove(direction: number) {
    setInteraction((previous) => previous + 1);
    move(direction);
  }

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => move(1), ROTATION_DELAY);
    return () => window.clearTimeout(timer);
  }, [rotating, position, interaction, move]);

  // Two entries get one real neighbor, rather than duplicated left and right cards.
  const visible = count === 1
    ? [{ project: projects[0], key: "only", slot: 0, index: 0 }]
    : count === 2
      ? projects.map((project, index) => ({
          project,
          key: String(index),
          slot: index === currentIndex ? 0 : 1,
          index,
        }))
      : count > 2
        ? slots.map((slot) => ({
            project: projects[wrap(position + slot, count)],
            key: String(position + slot),
            slot,
            index: wrap(position + slot, count),
          }))
        : [];

  return (
    <section
      className="projectShowcase"
      data-category={category}
      data-count={count}
      data-reduced-motion={reducedMotion}
      aria-labelledby={id}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={(event) => { if (event.target instanceof HTMLElement && event.target.matches(":focus-visible")) setFocused(true); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          manuallyMove(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className="projectShowcaseHeading">
        <h2 id={id}>{title}</h2>
        <span>{String(count).padStart(2, "0")} {category === "working" ? siteContent.projects.showcase.active : siteContent.projects.showcase.released}</span>
      </div>

      <div className="projectShowcaseStage" role="group" aria-roledescription="carousel" aria-label={title}>
        {count === 0 ? (
          <div className="projectShowcaseEmpty"><span aria-hidden="true">00 / 00</span><p>{emptyMessage}</p></div>
        ) : (
          <>
            <div className="projectShowcaseCards">
              {visible.map(({ project, key, slot, index }) => (
                <article
                  className="projectShowcaseCard"
                  key={key}
                  data-slot={slot}
                  data-image={Boolean(project.image)}
                  aria-hidden={slot !== 0}
                  inert={slot !== 0}
                >
                  <div className="projectShowcaseCardMeta">
                    <span>{category === "working" ? siteContent.projects.showcase.activeBuild : siteContent.projects.showcase.releasedWork}</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="projectShowcaseCardBody">
                    <div className="projectShowcaseCardCopy">
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                    </div>
                    {project.image && <img src={project.image} alt="" loading="lazy" />}
                  </div>
                  <div className="projectShowcaseCardTail">
                    {project.tags?.length ? (
                      <ul aria-label={siteContent.projects.showcase.technologies}>
                        {project.tags.slice(0, 2).map((tag) => <li key={tag}>{tag}</li>)}
                        {project.tags.length > 2 && <li>+{project.tags.length - 2}</li>}
                      </ul>
                    ) : (
                      <span className="projectShowcaseStatus"><span aria-hidden="true" />{project.status ?? siteContent.projects.showcase.development}</span>
                    )}
                    {category === "live" && slot === 0 && project.url?.trim() && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
                        {siteContent.projects.showcase.openProject} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
            {count > 1 && (
              <>
                <button className="projectShowcaseSide projectShowcasePrevious" onClick={() => manuallyMove(-1)} aria-label={`${siteContent.projects.showcase.previous}${title.toLowerCase()}${siteContent.projects.showcase.projectSuffix}${projects[wrap(position - 1, count)].title}`}>
                  <span aria-hidden="true">←</span>
                </button>
                <button className="projectShowcaseSide projectShowcaseNext" onClick={() => manuallyMove(1)} aria-label={`${siteContent.projects.showcase.next}${title.toLowerCase()}${siteContent.projects.showcase.projectSuffix}${projects[wrap(position + 1, count)].title}`}>
                  <span aria-hidden="true">→</span>
                </button>
              </>
            )}
          </>
        )}
      </div>

      <div className="projectShowcaseControls">
        <span aria-live={rotating ? "off" : "polite"} aria-atomic="true">
          <b>{String(count ? currentIndex + 1 : 0).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
        </span>
        {count > 1 && (
          <>
            <span className="projectShowcaseHint">{siteContent.projects.showcase.explore}</span>
            <button onClick={() => { setPaused((value) => !value); setInteraction((value) => value + 1); }} aria-label={`${paused ? siteContent.projects.showcase.resumeRotation : siteContent.projects.showcase.pauseRotation}${title.toLowerCase()}${siteContent.projects.showcase.automaticRotation}`}>
              {paused ? siteContent.projects.showcase.play : siteContent.projects.showcase.pause}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
