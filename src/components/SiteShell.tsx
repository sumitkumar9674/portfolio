import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useBlogsPage } from "../hooks/useBlogsPage";
import BlogsPage from "../pages/Blogs/BlogsPage";

export default function SiteShell({ children }: { children: ReactNode }) {
  const showingBlogs = useBlogsPage();
  const returnFocus = useRef<HTMLElement | null>(null);
  const reader = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.documentElement.dataset.page = showingBlogs ? "blogs" : "portfolio";
    if (showingBlogs) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.title = "Build notes · StickForYou";
      reader.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    } else {
      returnFocus.current?.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
    return () => {
      delete document.documentElement.dataset.page;
      document.title = previousTitle;
    };
  }, [showingBlogs]);

  return (
    <div className="siteShell">
      <div className="siteBackground" aria-hidden="true" />
      {/* Keep the cube mounted and measured, including while the journal is open. */}
      <div className="portfolioPresentation" data-hidden={showingBlogs} inert={showingBlogs} aria-hidden={showingBlogs}>
        {children}
      </div>
      {showingBlogs && <div ref={reader}><BlogsPage /></div>}
    </div>
  );
}
