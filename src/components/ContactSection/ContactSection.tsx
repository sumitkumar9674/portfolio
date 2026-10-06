// Displays contact information and social profile links.

import { useState, type ReactNode } from "react";
import { siteLinks } from "../../config/siteLinks";
import { siteContent } from "../../content/siteContent";
import "./ContactSection.css";

type ContactSectionProps = {
  cubeSize: number;
  variant?: "default" | "compact";
};

type SocialIconName = (typeof siteLinks.social)[number]["icon"];

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const socialIcons: Record<SocialIconName, ReactNode> = {
  instagram: (
      <Icon>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </Icon>
  ),
  x: (
      <Icon>
        <path
          d="M5 4L19 20M19 4L5 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Icon>
  ),
  reddit: (
      <Icon>
        <path
          fill="currentColor"
          stroke="none"
          d="M2.204 14.049c-.06.276-.091.56-.091.847 0 3.443 4.402 6.249 9.814 6.249 5.41 0 9.812-2.804 9.812-6.249 0-.274-.029-.546-.082-.809l-.015-.032a.443.443 0 0 1-.029-.165c-.302-1.175-1.117-2.241-2.296-3.103a.438.438 0 0 1-.193-.134c-1.792-1.234-4.356-2.008-7.196-2.008-2.815 0-5.354.759-7.146 1.971a.33.33 0 0 1-.179.124c-1.206.862-2.042 1.937-2.354 3.123a.448.448 0 0 1-.045.186Zm9.773 5.441c-1.794 0-3.057-.389-3.863-1.197a.448.448 0 0 1 0-.632.46.46 0 0 1 .635 0c.63.629 1.685.943 3.228.943 1.542 0 2.591-.3 3.219-.929a.45.45 0 0 1 .629 0 .462.462 0 0 1 0 .645c-.809.808-2.065 1.198-3.862 1.198l.014-.028Zm-3.606-7.573c-.914 0-1.677.765-1.677 1.677 0 .91.763 1.65 1.677 1.65s1.651-.74 1.651-1.65c0-.912-.739-1.677-1.651-1.677Zm7.233 0c-.914 0-1.678.765-1.678 1.677 0 .91.764 1.65 1.678 1.65s1.651-.74 1.651-1.65c0-.912-.739-1.677-1.651-1.677Zm4.548-1.595c1.037.833 1.8 1.821 2.189 2.904.45-.336.719-.864.719-1.449 0-1.002-.815-1.816-1.818-1.816-.399 0-.778.129-1.09.363v-.002ZM2.711 9.963c-1.003 0-1.817.816-1.817 1.818 0 .543.239 1.048.644 1.389.401-1.079 1.172-2.053 2.213-2.876-.302-.21-.663-.329-1.039-.329v-.002Zm9.217 12.079c-5.906 0-10.709-3.205-10.709-7.142 0-.275.023-.544.068-.809C.494 13.598 0 12.729 0 11.777c0-1.496 1.227-2.713 2.725-2.713.674 0 1.303.246 1.797.682 1.856-1.191 4.357-1.941 7.112-1.992l1.812-5.524.404.095 4.239.995c.344-.798 1.138-1.36 2.065-1.36 1.229 0 2.231 1.004 2.231 2.234 0 1.232-1.003 2.234-2.231 2.234s-2.23-1.004-2.23-2.23l-3.851-.912-1.467 4.477c2.65.105 5.047.854 6.844 2.021.494-.464 1.144-.719 1.833-.719 1.498 0 2.718 1.213 2.718 2.711 0 .987-.54 1.886-1.378 2.365.029.255.059.494.059.749-.015 3.938-4.806 7.143-10.72 7.143l-.034.009Zm8.179-19.187c-.74 0-1.34.599-1.34 1.338 0 .738.6 1.34 1.34 1.34.732 0 1.33-.6 1.33-1.334 0-.733-.598-1.332-1.347-1.332l.017-.012Z"
        />
      </Icon>
  ),
  github: (
      <Icon>
        <path
          d="M12 3.5C7.3 3.5 3.5 7.4 3.5 12.1C3.5 16 6 19.3 9.5 20.4V17.3C7.2 17.8 6.5 16.2 6.5 16.2C6 15 5.3 14.6 5.3 14.6C4.3 14 5.4 14 5.4 14C6.6 14.1 7.2 15.3 7.2 15.3C8.2 17 9.8 16.5 10.5 16.2C10.6 15.4 10.9 14.9 11.2 14.7C9.3 14.5 7.3 13.7 7.3 10.5C7.3 9.6 7.6 8.8 8.2 8.1C8.1 7.9 7.9 7 8.3 5.9C8.3 5.9 9.1 5.6 11.2 7C11.9 6.8 12.6 6.7 13.3 6.7C14 6.7 14.7 6.8 15.4 7C17.5 5.6 18.3 5.9 18.3 5.9C18.7 7 18.5 7.9 18.4 8.1C19 8.8 19.3 9.6 19.3 10.5C19.3 13.7 17.3 14.5 15.4 14.7C15.8 15 16.1 15.6 16.1 16.5V20.4C19.6 19.3 22.1 16 22.1 12.1C22.1 7.4 18.3 3.5 13.6 3.5H12Z"
          fill="currentColor"
        />
      </Icon>
  ),
  linkedin: (
      <Icon>
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <path
          d="M8 11V16M11 16V11M11 13.5C11 12 12 11 13.5 11C15 11 16 12 16 13.5V16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Icon>
  ),
};

export default function ContactSection({
  cubeSize,
  variant = "default",
}: ContactSectionProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = async (value: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.setAttribute("readonly", "");
      textArea.setAttribute("aria-hidden", "true");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);

      let copied = false;
      try {
        textArea.select();
        copied = document.execCommand("copy");
      } finally {
        textArea.remove();
      }

      if (!copied) return;
    }

    setCopiedValue(value);

    window.setTimeout(() => {
      setCopiedValue(null);
    }, 2000);
  };

  const renderCopyButton = (value: string) => {
    const isCopied = copiedValue === value;

    return (
      <button
        type="button"
        className="contactCopyButton"
        onClick={() => copyToClipboard(value)}
        aria-label={isCopied ? `${siteContent.contact.copied}${value}` : `${siteContent.contact.copy}${value}`}
      >
        {isCopied ? "✓" : "⧉"}
      </button>
    );
  };

  return (
    <div
      className={`contactSection${variant === "compact" ? " contactSectionCompact" : ""}`}
      style={
        {
          "--cube-size": `${cubeSize}px`,
        } as React.CSSProperties
      }
    >
      <div className="contactDetails">
        <div className="contactItem">
          <span className="contactIcon">
            <Icon>
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M4 7L12 13L20 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Icon>
          </span>

          <span className="contactValue">{siteLinks.email}</span>

          {renderCopyButton(siteLinks.email)}
        </div>

        <div className="contactItem">
          <span className="contactIcon">
            <Icon>
              <path
                d="M7 4L10 3L12 7L10 9C11 11 13 13 15 14L17 12L21 14L20 17C19.5 18.5 18 19.5 16.5 19C10.5 17.5 6.5 13.5 5 7.5C4.5 6 5.5 4.5 7 4Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Icon>
          </span>

          <span className="contactValue">{siteLinks.phone}</span>

          {renderCopyButton(siteLinks.phone)}
        </div>
      </div>

      {variant === "default" && (
        <div className="contactSocials">
          {siteLinks.social.map((social) => (
            <a
              key={social.name}
              href={social.url || undefined}
              className="contactSocial"
              aria-label={social.name}
              title={social.name}
              onClick={(event) => {
                if (!social.url) {
                  event.preventDefault();
                }
              }}
            >
              {socialIcons[social.icon]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
