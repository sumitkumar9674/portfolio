// Public contact details and destinations. Keep credentials and private values out of frontend code.

const githubUsername = "sumitkumar9674";
const githubProfileUrl = `https://github.com/${githubUsername}`;

const linkedInProfileUrl = "https://www.linkedin.com/in/sumit-kumar-53a069283/";

export const siteLinks = {
  // Contact
  email: "contact@sfysumit.app",
  phone: "9764536604",

  // GitHub activity/profile.
  github: {
    username: githubUsername,
    profileUrl: githubProfileUrl,
  },

  // Social links.
  social: [
    { name: "Instagram", icon: "instagram", url: "" },
    { name: "X", icon: "x", url: "" },
    { name: "Reddit", icon: "reddit", url: "" },
    { name: "GitHub", icon: "github", url: githubProfileUrl },
    { name: "LinkedIn", icon: "linkedin", url: linkedInProfileUrl },
  ],
} as const;
