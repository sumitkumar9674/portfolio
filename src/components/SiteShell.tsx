import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useBlogsPage, useContactPage } from "../hooks/useBlogsPage";
import BlogsPage from "../pages/Blogs/BlogsPage";
import ContactPage from "../pages/Contact/ContactPage";
import { siteContent } from "../content/siteContent";

export default function SiteShell({ children }: { children: ReactNode }) {
  const showingBlogs = useBlogsPage();
  const showingContact = useContactPage();
  const standalonePage = showingBlogs ? "blogs" : showingContact ? "contact" : null;
  const returnFocus = useRef<HTMLElement | null>(null);
  const reader = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.documentElement.dataset.page = standalonePage ?? "portfolio";
    if (standalonePage) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.title = `${standalonePage === "blogs" ? siteContent.journal.documentTitlePrefix : siteContent.contact.documentTitlePrefix}${siteContent.brand.name}`;
      reader.current?.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    } else {
      returnFocus.current?.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
    return () => {
      delete document.documentElement.dataset.page;
      document.title = previousTitle;
    };
  }, [standalonePage]);

  return (
    <div className="siteShell">
      <div className="siteBackground" aria-hidden="true" />
      {/* Keep the selected portfolio presentation mounted while a full page is open. */}
      <div className="portfolioPresentation" data-hidden={standalonePage !== null} inert={standalonePage !== null} aria-hidden={standalonePage !== null}>
        {children}
      </div>
      {standalonePage && <div ref={reader}>{showingBlogs ? <BlogsPage /> : <ContactPage />}</div>}
    </div>
  );
}
