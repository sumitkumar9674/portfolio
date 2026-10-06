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
      <path
        fill="currentColor"
        stroke="none"
        d="M2.204 14.049c-.06.276-.091.56-.091.847 0 3.443 4.402 6.249 9.814 6.249 5.41 0 9.812-2.804 9.812-6.249 0-.274-.029-.546-.082-.809l-.015-.032a.443.443 0 0 1-.029-.165c-.302-1.175-1.117-2.241-2.296-3.103a.438.438 0 0 1-.193-.134c-1.792-1.234-4.356-2.008-7.196-2.008-2.815 0-5.354.759-7.146 1.971a.33.33 0 0 1-.179.124c-1.206.862-2.042 1.937-2.354 3.123a.448.448 0 0 1-.045.186Zm9.773 5.441c-1.794 0-3.057-.389-3.863-1.197a.448.448 0 0 1 0-.632.46.46 0 0 1 .635 0c.63.629 1.685.943 3.228.943 1.542 0 2.591-.3 3.219-.929a.45.45 0 0 1 .629 0 .462.462 0 0 1 0 .645c-.809.808-2.065 1.198-3.862 1.198l.014-.028Zm-3.606-7.573c-.914 0-1.677.765-1.677 1.677 0 .91.763 1.65 1.677 1.65s1.651-.74 1.651-1.65c0-.912-.739-1.677-1.651-1.677Zm7.233 0c-.914 0-1.678.765-1.678 1.677 0 .91.764 1.65 1.678 1.65s1.651-.74 1.651-1.65c0-.912-.739-1.677-1.651-1.677Zm4.548-1.595c1.037.833 1.8 1.821 2.189 2.904.45-.336.719-.864.719-1.449 0-1.002-.815-1.816-1.818-1.816-.399 0-.778.129-1.09.363v-.002ZM2.711 9.963c-1.003 0-1.817.816-1.817 1.818 0 .543.239 1.048.644 1.389.401-1.079 1.172-2.053 2.213-2.876-.302-.21-.663-.329-1.039-.329v-.002Zm9.217 12.079c-5.906 0-10.709-3.205-10.709-7.142 0-.275.023-.544.068-.809C.494 13.598 0 12.729 0 11.777c0-1.496 1.227-2.713 2.725-2.713.674 0 1.303.246 1.797.682 1.856-1.191 4.357-1.941 7.112-1.992l1.812-5.524.404.095 4.239.995c.344-.798 1.138-1.36 2.065-1.36 1.229 0 2.231 1.004 2.231 2.234 0 1.232-1.003 2.234-2.231 2.234s-2.23-1.004-2.23-2.23l-3.851-.912-1.467 4.477c2.65.105 5.047.854 6.844 2.021.494-.464 1.144-.719 1.833-.719 1.498 0 2.718 1.213 2.718 2.711 0 .987-.54 1.886-1.378 2.365.029.255.059.494.059.749-.015 3.938-4.806 7.143-10.72 7.143l-.034.009Zm8.179-19.187c-.74 0-1.34.599-1.34 1.338 0 .738.6 1.34 1.34 1.34.732 0 1.33-.6 1.33-1.334 0-.733-.598-1.332-1.347-1.332l.017-.012Z"
      />
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
  cubeSize?: number;
  variant?: "default" | "compact";
};

export default function SocialLinks({ cubeSize, variant = "default" }: SocialLinksProps) {
  return (
    <section
      className={`socialLinks${variant === "compact" ? " socialLinksCompact" : ""}`}
      aria-label={siteContent.social.ariaLabel}
      style={cubeSize === undefined ? undefined : { "--cube-size": `${cubeSize}px` } as React.CSSProperties}
    >
      {variant === "default" && <span className="socialLinksLabel">{siteContent.social.heading}</span>}
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
                disabled
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
