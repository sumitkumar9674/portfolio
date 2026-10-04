export type Project = {
  title: string;
  description: string;
  status?: string;
  image?: string;
  url?: string;
  tags?: string[];
};

// Currently Working
// Currently Working
export const currentlyWorking: Project[] = [
  {
    title: "Portfolio Cube",
    description:
      "A dual-mode developer portfolio with a six-face 3D experience in landscape and a scrollable layout in portrait.",
    status: "IN PROGRESS",
  },
  {
    title: "Horizon",
    description:
      "A productivity app built around Parkinson’s Law, structured daily planning, streaks, and a server-driven task engine.",
    status: "IN PROGRESS",
  },
  {
    title: "Gaming Café Control System",
    description:
      "A local-network control system for timed gaming sessions, user logins, remote time assignment, and client-PC access control.",
    status: "IN PROGRESS",
  },
];

// Add shipped projects here. Images and URLs are optional.
export const liveProjects: Project[] = [];
