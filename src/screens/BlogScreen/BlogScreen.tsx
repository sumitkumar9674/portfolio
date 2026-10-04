// Editorial notes displayed on the permanently mounted Blog cube face.
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { blogPosts } from "../../data/blogPosts";
import { siteContent } from "../../content/siteContent";
import { useBlogsPage } from "../../hooks/useBlogsPage";
import "./BlogScreen.css";

type BlogScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

const ROTATION_DELAY = 7000;
const TRANSITION_DURATION = 450;
const slots = [-2, -1, 0, 1, 2];
const wrap = (index: number) => ((index % blogPosts.length) + blogPosts.length) % blogPosts.length;
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
function subscribeMotion(onChange: () => void) {
  motionPreference.addEventListener("change", onChange);
  return () => motionPreference.removeEventListener("change", onChange);
}
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export default function BlogScreen({ isActive, isFirstOpen }: BlogScreenProps) {
  // Unbounded positions keep each moving card's identity stable across the loop boundary.
  const [position, setPosition] = useState(0);
  const [interaction, setInteraction] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => motionPreference.matches);
  const documentVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden);
  const showingBlogs = useBlogsPage();
  const lockedUntil = useRef(0);
  const activePost = blogPosts[wrap(position)];
  const rotating = isActive && !showingBlogs && documentVisible && !paused && !focused && !hovered;

  const move = useCallback((direction: number) => {
    if (performance.now() < lockedUntil.current || blogPosts.length < 2) return;
    lockedUntil.current = performance.now() + (reducedMotion ? 0 : TRANSITION_DURATION);
    setPosition((previous) => previous + direction);
  }, [reducedMotion]);

  function manuallyMove(direction: number) {
    setInteraction((previous) => previous + 1);
    move(direction);
  }

  useEffect(() => {
    if (!rotating || blogPosts.length < 2) return;
    const timer = window.setTimeout(() => move(1), ROTATION_DELAY);
    return () => window.clearTimeout(timer);
  }, [rotating, position, interaction, move]);

  return (
    <section
      className="blogScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      data-reduced-motion={reducedMotion}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="blog-title"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          manuallyMove(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <header className="blogHeader">
        <div className="blogMeta"><span>{siteContent.blog.eyebrow}</span><span>{siteContent.blog.meta}</span></div>
        <h1 id="blog-title">{siteContent.blog.headingLines.join(" ")}</h1>
        <p>{siteContent.blog.introduction}</p>
      </header>

      <div className="blogCarousel" role="region" aria-roledescription="carousel" aria-label={siteContent.blog.carouselLabel}>
        <div className="blogCardStage">
          {slots.map((slot) => {
            const cardPosition = position + slot;
            const post = blogPosts[wrap(cardPosition)];
            return (
              <article
                className="blogPreview"
                key={cardPosition}
                data-slot={slot}
                aria-hidden={slot !== 0}
                inert={Math.abs(slot) > 1}
              >
                <div className="blogPreviewMeta"><span>{post.category}</span><span>{post.index}</span></div>
                <h2>{post.title}</h2>
                <p>{post.summary}</p>
                <ul className="blogPreviewTags" aria-label={siteContent.blog.topicsLabel}>
                  {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                <div className="blogPreviewStatus"><span className="blogStatusDot" />{post.status}<span aria-hidden="true">↗</span></div>
              </article>
            );
          })}
        </div>
        {/* Stationary hit targets retain keyboard focus as the visual cards exchange places. */}
        <button className="blogSideTarget blogSidePrevious" onClick={() => manuallyMove(-1)} aria-label={`${siteContent.blog.previousArticle}${blogPosts[wrap(position - 1)].title}`}><span aria-hidden="true">←</span></button>
        <button className="blogSideTarget blogSideNext" onClick={() => manuallyMove(1)} aria-label={`${siteContent.blog.nextArticle}${blogPosts[wrap(position + 1)].title}`}><span aria-hidden="true">→</span></button>
      </div>

      <div className="blogControls">
        <div className="blogPosition" aria-live={rotating ? "off" : "polite"} aria-atomic="true">
          <span>{String(wrap(position) + 1).padStart(2, "0")}</span> / {String(blogPosts.length).padStart(2, "0")}
          <span className="blogAccessible"> — {activePost.title}</span>
        </div>
        <span className="blogBrowseHint">{siteContent.blog.explore}</span>
        <button className="blogRotation" onClick={() => { setPaused((value) => !value); setInteraction((value) => value + 1); }} aria-label={paused ? siteContent.blog.resumeRotation : siteContent.blog.pauseRotation}>
          {paused ? siteContent.blog.play : siteContent.blog.pause}
        </button>
      </div>
      <footer className="blogFooter">
        <span>{siteContent.blog.footer}</span>
        <a href="#/blogs">{siteContent.blog.viewAll} <span aria-hidden="true">↗</span></a>
      </footer>
    </section>
  );
}
