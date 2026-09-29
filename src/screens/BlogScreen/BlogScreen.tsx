import "./BlogScreen.css";

type BlogScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

export default function BlogScreen({ isActive, isFirstOpen }: BlogScreenProps) {
  return (
    <section
      className="blogScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="blog-title"
    >
      <header className="screenHeading">
        <span className="screenEyebrow">FIELD NOTES · 05</span>
        <h1 id="blog-title">Ideas, in the making.</h1>
        <p>Notes on the details behind useful, expressive digital products.</p>
      </header>
      <div className="blogFeature">
        <div className="blogOrbit" aria-hidden="true"><span>01</span></div>
        <div className="blogFeatureCopy">
          <span className="blogStatus"><span className="statusDot" /> WRITING DESK OPEN</span>
          <h2>The first field notes are taking shape.</h2>
          <p>Design decisions, lessons from the build, and small experiments will live here soon.</p>
        </div>
      </div>
      <footer className="screenFooter"><span>PROCESS OVER POLISH</span><span>NEW NOTES SOON ↗</span></footer>
    </section>
  );
}
