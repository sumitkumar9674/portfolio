import { blogPosts } from "../../data/blogPosts";
import "./BlogsPage.css";

export default function BlogsPage() {
  return (
    <main className="journalPage">
      <nav className="journalNav" aria-label="Journal navigation">
        <a href="#/">← Back to portfolio</a>
        <span>STICKFORYOU <span aria-hidden="true">/</span> JOURNAL</span>
      </nav>
      <header className="journalHeader">
        <p className="journalEyebrow">ENGINEERING NOTES · BUILD LOG</p>
        <h1 tabIndex={-1}>Notes from<br />the build.</h1>
        <p>Decisions, experiments, and the work behind the things I make. A record of what is working, what is in progress, and what still needs proving.</p>
        <span className="journalCount">{String(blogPosts.length).padStart(2, "0")} NOTES / AN OPEN NOTEBOOK</span>
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
            <ul className="journalTags" aria-label="Topics">
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <footer className="journalFooter">
        <span>END OF NOTES / MORE TO BUILD</span>
        <a href="#/">Back to portfolio ↗</a>
      </footer>
    </main>
  );
}
