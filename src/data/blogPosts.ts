// Shared article content for the cube showcase and the full journal.
type BlogSection = {
  heading: string;
  body: string;
};

export type BlogPost = {
  id: string;
  index: string;
  category: string;
  status: string;
  title: string;
  summary: string;
  sections: BlogSection[];
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    id: "local-gaming-cafe",
    index: "03",
    category: "SYSTEM REQUIREMENTS",
    status: "IN DESIGN",
    title: "Defining a local gaming café control system",
    summary:
      "Before deciding how to build it, I wanted to define exactly what a café control system must guarantee when dozens of gaming PCs depend on it.",
    sections: [
      {
        heading: "The system stays inside the café",
        body: "The core system should operate over the café's local network. An owner or administrator machine controls the gaming PCs without depending on a cloud database or an internet connection for essential session management. The internet can disappear and the café should still be able to start, extend, end, and track local sessions.",
      },
      {
        heading: "A login does not always mean a timer",
        body: "A user should be able to sign into a gaming PC before any time is assigned. The administrator can then add minutes to that session, extend the remaining time while the user is playing, or authorize a no-timer session when unrestricted access is appropriate. Session identity and session duration therefore need to be separate concepts.",
      },
      {
        heading: "An active session should feel like a normal PC",
        body: "While time remains, the customer should be able to use the machine normally. Games may require launchers, browsers, voice tools, stat trackers, or companion applications, so switching between legitimate applications cannot be treated as suspicious behavior. Restrictions should appear when the session boundary is reached, not continuously interfere with normal play.",
      },
      {
        heading: "Expiration has to mean expiration",
        body: "When the assigned time reaches zero, showing a timer is not enough. The machine must enter a controlled locked state that prevents the customer from continuing to use applications outside the session. An administrator must still be able to add more time remotely and immediately return the machine to an active session without requiring a full restart.",
      },
      {
        heading: "The client has to protect itself",
        body: "The management client cannot rely on the user voluntarily leaving it alone. A normal customer account should not be able to modify its files, disable the session controller, close the lock state, or gain access through ordinary desktop tools once the session has expired. Administrative maintenance still needs a deliberate path, so protection and legitimate management have to coexist.",
      },
      {
        heading: "Failures are requirements too",
        body: "The design also has to define what happens when a client disconnects from the LAN, the administrator machine restarts, a gaming PC reboots during a session, or an expired session remains idle. Those cases determine whether the system is dependable in a real café. The project therefore starts with session rules, authority, recovery, and enforcement before choosing the final implementation.",
      },
    ],
    tags: [
      "Local network",
      "Windows",
      "Session control",
      "System design",
      "Access control",
    ],
  },

  {
    id: "building-the-portfolio",
    index: "02",
    category: "BUILD LOG",
    status: "LIVE",
    title: "Building the portfolio I wanted to explore",
    summary:
      "The goal was never to put six portfolio pages behind a fancy animation. I wanted the portfolio itself to become one of the projects.",
    sections: [
      {
        heading: "Start with one object",
        body: "The landscape version began with a simple rule: the portfolio is a cube, and every major screen owns a permanent physical face. Home, Projects, Forge, Blog, Contact, and SpaceDefender are not swapped into the front when navigation changes. The entire cube rotates until the correct face reaches the visitor. That made navigation part of the experience instead of decoration around it.",
      },
      {
        heading: "Make the cube the responsive environment",
        body: "Once the screens lived on a three-dimensional object, normal viewport-based responsive thinking stopped making sense inside the faces. The cube already changes size depending on the available space, so the content inside it scales relative to that cube. Typography, spacing, cards, and interface details use the face as their responsive environment rather than independently reacting to the browser window.",
      },
      {
        heading: "Portrait mode needed a different answer",
        body: "Trying to force the cube into a tall screen would have preserved the concept at the expense of the experience. The finished site therefore makes one decision during startup: landscape loads the cube, while portrait loads a normal vertically scrolling portfolio. The content remains shared, but the presentation changes. Contact can grow naturally, Projects stays controlled, and navigation simply moves through sections instead of rotating an object.",
      },
      {
        heading: "The browser became part of the problem",
        body: "Some of the hardest bugs had little to do with what was visible on screen. Chrome allowed wheel scrolling on transformed cube faces while refusing touch panning on particular faces. The markup, CSS, scroll range, and hit testing could all appear correct while browser compositing still behaved differently. Fixing those problems made the project a lesson in how ordinary DOM behavior can become less ordinary once transforms and 3D composition are involved.",
      },
      {
        heading: "Finish by making it maintainable",
        body: "Once the experience worked, I moved the things I expect to change out of the components themselves. Colors live in a central theme, normal website copy lives in one content source, links and contact destinations have their own configuration, and projects and articles have dedicated data files. The goal is that changing the portfolio later should mean editing its content, not rediscovering how every screen was implemented.",
      },
    ],
    tags: [
      "React",
      "TypeScript",
      "CSS 3D",
      "Responsive design",
      "System design",
    ],
  },
  {
    id: "about-the-builder",
    index: "01",
    category: "PERSONAL NOTE",
    status: "ABOUT ME",
    title: "I like building the whole thing",
    summary:
      "I enjoy the point where design, code, systems, and problem solving stop being separate skills and start becoming one product.",
    sections: [
      {
        heading: "I was never interested in only one layer",
        body: "I like interfaces, but I also want to know what happens after the button is pressed. I like mobile applications, but I also want to understand the APIs, authentication, databases, and rules behind them. That curiosity naturally pulled me toward full-stack development: not because every project needs one person doing everything, but because understanding the whole product helps me make better decisions inside each part of it.",
      },
      {
        heading: "Building is how I learn",
        body: "Most things become real to me when I have something to build around them. A concept in isolation is useful; a concept that has to survive inside a working product teaches me much more. That is why my projects tend to become experiments in more than one area at once: interface design, mobile development, backend architecture, real-time behavior, system design, or whatever the idea forces me to learn next.",
      },
      {
        heading: "I care about how software feels",
        body: "Working software is only part of the job. I pay attention to how someone understands an interface, how an interaction responds, how much friction a flow creates, and whether the product feels intentional. UI and UX are not decorations added after the engineering is finished; they are part of how the system communicates with the person using it.",
      },
      {
        heading: "There is always another layer",
        body: "I am interested in full-stack engineering, mobile development, system design, algorithms, and increasingly AI-driven products. I do not expect that list to stop growing. The part I enjoy most is being given an idea or a difficult problem, figuring out what I do not know yet, and working forward until it becomes something real.",
      },
    ],
    tags: ["Full-stack", "UI / UX", "System design", "Product thinking"],
  },
];
