// Displays contact information and social profile links.

import { useState, type ReactNode } from "react";
import "./ContactSection.css";

type ContactSectionProps = {
  cubeSize: number;
};

type SocialLink = {
  name: string;
  url: string;
  icon: ReactNode;
};

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {children}
  </svg>
);

const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    url: "",
    icon: (
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
  },
  {
    name: "X",
    url: "",
    icon: (
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
  },
  {
    name: "Reddit",
    url: "",
    icon: (
      <Icon>
        <circle
          cx="12"
          cy="13"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="9" cy="12" r="1.2" fill="currentColor" />
        <circle cx="15" cy="12" r="1.2" fill="currentColor" />
        <path
          d="M9 15C10.5 16.5 13.5 16.5 15 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M15 6L16.5 3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="3" r="1.2" fill="currentColor" />
      </Icon>
    ),
  },
  {
    name: "GitHub",
    url: "",
    icon: (
      <Icon>
        <path
          d="M12 3.5C7.3 3.5 3.5 7.4 3.5 12.1C3.5 16 6 19.3 9.5 20.4V17.3C7.2 17.8 6.5 16.2 6.5 16.2C6 15 5.3 14.6 5.3 14.6C4.3 14 5.4 14 5.4 14C6.6 14.1 7.2 15.3 7.2 15.3C8.2 17 9.8 16.5 10.5 16.2C10.6 15.4 10.9 14.9 11.2 14.7C9.3 14.5 7.3 13.7 7.3 10.5C7.3 9.6 7.6 8.8 8.2 8.1C8.1 7.9 7.9 7 8.3 5.9C8.3 5.9 9.1 5.6 11.2 7C11.9 6.8 12.6 6.7 13.3 6.7C14 6.7 14.7 6.8 15.4 7C17.5 5.6 18.3 5.9 18.3 5.9C18.7 7 18.5 7.9 18.4 8.1C19 8.8 19.3 9.6 19.3 10.5C19.3 13.7 17.3 14.5 15.4 14.7C15.8 15 16.1 15.6 16.1 16.5V20.4C19.6 19.3 22.1 16 22.1 12.1C22.1 7.4 18.3 3.5 13.6 3.5H12Z"
          fill="currentColor"
        />
      </Icon>
    ),
  },
  {
    name: "LinkedIn",
    url: "",
    icon: (
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
  },
];

export default function ContactSection({ cubeSize }: ContactSectionProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const copyToClipboard = async (value: string) => {
    await navigator.clipboard.writeText(value);

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
        aria-label={isCopied ? "Copied" : "Copy"}
      >
        {isCopied ? "✓" : "⧉"}
      </button>
    );
  };

  return (
    <div
      className="contactSection"
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

          <span className="contactValue">sumitkumar9674@gmail.com</span>

          {renderCopyButton("sumitkumar9674@gmail.com")}
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

          <span className="contactValue">9764536604</span>

          {renderCopyButton("9764536604")}
        </div>
      </div>

      <div className="contactSocials">
        {socialLinks.map((social) => (
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
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
