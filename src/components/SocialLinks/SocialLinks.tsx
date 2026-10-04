import type { ReactNode } from "react";
import { siteLinks } from "../../config/siteLinks";
import { siteContent } from "../../content/siteContent";
import "./SocialLinks.css";

type SocialIconName = "instagram" | "x" | "reddit" | "github" | "linkedin";

const socialIcons: Record<SocialIconName, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle className="socialIconDot" cx="17.7" cy="6.5" r="1" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        className="socialIconFill"
        d="M18.9 2.8h3.2l-7 8 8.2 10.4h-6.4l-5-6.5-5.7 6.5H3l7.5-8.6-7.7-9.8h6.6l4.5 5.9 5-5.9Zm-1.1 16.6h1.8L8.4 4.5H6.5l11.3 14.9Z"
      />
    </svg>
  ),
  reddit: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m14.1 7.1 1.1-3.7 3 .7" />
      <circle className="socialIconDot" cx="19.1" cy="4.1" r="1.25" />
      <path d="M19.3 10.1a8.7 8.7 0 0 0-14.6 0 2.1 2.1 0 1 0-.2 3.8 7.1 7.1 0 0 0 15 0 2.1 2.1 0 1 0-.2-3.8Z" />
      <circle className="socialIconFill" cx="9" cy="12.3" r="1" />
      <circle className="socialIconFill" cx="15" cy="12.3" r="1" />
      <path d="M9.5 15.2c1.4 1.1 3.6 1.1 5 0" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        className="socialIconFill"
        d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z"
      />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        className="socialIconFill"
        d="M19.4 3H4.6A1.6 1.6 0 0 0 3 4.6v14.8A1.6 1.6 0 0 0 4.6 21h14.8a1.6 1.6 0 0 0 1.6-1.6V4.6A1.6 1.6 0 0 0 19.4 3ZM8.3 18H5.6V9.2h2.7V18ZM7 8a1.6 1.6 0 1 1 0-3.2A1.6 1.6 0 0 1 7 8Zm11 10h-2.7v-4.3c0-1-.02-2.2-1.4-2.2s-1.6 1.1-1.6 2.1V18H9.6V9.2h2.6v1.2h.04a2.9 2.9 0 0 1 2.6-1.4c2.8 0 3.2 1.8 3.2 4.1V18Z"
      />
    </svg>
  ),
};

type SocialLinksProps = {
  cubeSize: number;
};

export default function SocialLinks({ cubeSize }: SocialLinksProps) {
  return (
    <section
      className="socialLinks"
      aria-label={siteContent.social.ariaLabel}
      style={{ "--cube-size": `${cubeSize}px` } as React.CSSProperties}
    >
      <span className="socialLinksLabel">{siteContent.social.heading}</span>
      <ul className="socialLinksList">
        {siteLinks.social.map((platform) => (
          <li key={platform.name}>
            {platform.url ? (
              <a
                className="socialLinkControl"
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                aria-label={platform.name}
                title={platform.name}
              >
                {socialIcons[platform.icon]}
              </a>
            ) : (
              <button
                className="socialLinkControl"
                type="button"
                aria-label={`${platform.name}${siteContent.social.comingSoonSuffix}`}
                title={`${platform.name}${siteContent.social.comingSoonSuffix}`}
              >
                {socialIcons[platform.icon]}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
