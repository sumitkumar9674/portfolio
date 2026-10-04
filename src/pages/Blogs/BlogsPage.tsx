import { blogPosts } from "../../data/blogPosts";
import { siteContent } from "../../content/siteContent";
import "./BlogsPage.css";

export default function BlogsPage() {
  return (
    <main className="journalPage">
      <nav className="journalNav" aria-label={siteContent.journal.navigationLabel}>
        <a href="#/">{siteContent.journal.back}</a>
        <span>{siteContent.brand.name.toUpperCase()} <span aria-hidden="true">/</span> {siteContent.journal.brandSuffix}</span>
      </nav>
      <header className="journalHeader">
        <p className="journalEyebrow">{siteContent.blog.meta}</p>
        <h1 tabIndex={-1}>{siteContent.blog.headingLines[0]}<br />{siteContent.blog.headingLines[1]}</h1>
        <p>{siteContent.blog.introduction} {siteContent.journal.introductionSecondSentence}</p>
        <span className="journalCount">{String(blogPosts.length).padStart(2, "0")} {siteContent.journal.countSuffix}</span>
      </header>
      <div className="journalArticles">
        {blogPosts.map((post) => (
          <article className="journalArticle" key={post.id} aria-labelledby={`journal-${post.id}`}>
            <div className="journalArticleMeta">
              <span>{post.index} / {post.category}</span>
              <span>{post.status}</span>
            </div>
            <h2 id={`journal-${post.id}`}>{post.title}</h2>
            <p className="journalSummary">{post.summary}</p>
            <div className="journalBody">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
            <ul className="journalTags" aria-label={siteContent.blog.topicsLabel}>
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <footer className="journalFooter">
        <span>{siteContent.journal.footer}</span>
        <a href="#/">{siteContent.journal.backFooter}</a>
      </footer>
    </main>
  );
}
