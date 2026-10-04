// Public contact details and destinations. Keep credentials and private values out of frontend code.
const githubUsername = "sumitkumar9674";

export const siteLinks = {
  // Contact
  email: "sumitkumar9674@gmail.com",
  phone: "9764536604",

  // GitHub activity/profile (currently linked from Forge).
  github: {
    username: githubUsername,
    profileUrl: `https://github.com/${githubUsername}`,
  },

  // Social controls currently have no destinations. Preserve their disabled-link behavior.
  social: [
    { name: "Instagram", icon: "instagram", url: "" },
    { name: "X", icon: "x", url: "" },
    { name: "Reddit", icon: "reddit", url: "" },
    { name: "GitHub", icon: "github", url: "" },
    { name: "LinkedIn", icon: "linkedin", url: "" },
  ],
} as const;
