import GitHubActivity from "../../components/GitHubActivity/GitHubActivity";
import { siteLinks } from "../../config/siteLinks";
import { siteContent } from "../../content/siteContent";
import "./SkillsScreen.css";

type SkillsScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

export default function SkillsScreen({ isActive, isFirstOpen }: SkillsScreenProps) {
  return (
    <section
      className="forgeScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="forge-title"
    >
      <header className="forgeHeader">
        <div className="forgeMeta">
          <span>{siteContent.forge.eyebrow} <span aria-hidden="true">/</span> {siteContent.forge.index}</span>
          <span>{siteContent.forge.meta}</span>
        </div>
        <div className="forgeIntroduction">
          <h1 id="forge-title">{siteContent.forge.heading}</h1>
          <p>{siteContent.forge.introduction}</p>
        </div>
      </header>

      <section className="forgeCapabilities" aria-labelledby="forge-capabilities-title">
        <div className="forgeSectionHeading">
          <h2 id="forge-capabilities-title">{siteContent.forge.capabilitiesTitle}</h2>
          <span>{siteContent.forge.capabilitiesFlow}</span>
        </div>
        <div className="forgeCapabilityGrid">
          {siteContent.forge.capabilities.map((capability) => (
            <article className="forgeCapability" key={capability.number}>
              <div className="forgeCapabilityHeading">
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{capability.description}</p>
              <small>{capability.tools}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="forgeActivity" aria-labelledby="forge-activity-title">
        <div className="forgeSectionHeading">
          <h2 id="forge-activity-title">{siteContent.forge.activityTitle}</h2>
          <a
            href={siteLinks.github.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{siteLinks.github.username.toUpperCase()} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="forgeActivityPanel">
          <div className="forgeActivityLabel">
            <span>{siteContent.forge.activityLabel}</span>
            <span>{siteContent.forge.activityPeriod}</span>
          </div>
          <GitHubActivity />
        </div>
      </section>

      <footer className="forgeFooter">
        <span>{siteContent.forge.footerMotto}</span>
        <span><span className="forgeStatusDot" aria-hidden="true" /> {siteContent.forge.footerStatus}</span>
      </footer>
    </section>
  );
}
