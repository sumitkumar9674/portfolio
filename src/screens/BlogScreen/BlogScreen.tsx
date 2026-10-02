// Editorial notes displayed on the permanently mounted Blog cube face.
import "./BlogScreen.css";

type BlogScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

type BlogSection = {
  heading: string;
  body: string;
};

type BlogPost = {
  id: string;
  index: string;
  category: string;
  status: string;
  title: string;
  summary: string;
  sections: BlogSection[];
  tags: string[];
};

const posts: BlogPost[] = [
  {
    id: "portfolio-cube",
    index: "01",
    category: "ENGINEERING NOTE",
    status: "LIVE BUILD",
    title: "Building a portfolio around a 3D cube",
    summary:
      "I wanted the portfolio to feel like one object to explore, rather than six pages dressed up as a cube.",
    sections: [
      {
        heading: "Give every screen an address",
        body: "Home, Projects, Forge, Blog, Contact, and SpaceDefender live on six permanent faces. Navigation rotates the whole cube. I do not replace a face's component or turn an individual screen toward the camera. That rule makes the visible screen a result of the cube's orientation, rather than a separate routing trick.",
      },
      {
        heading: "Make the movement exact",
        body: "A quaternion holds the cube's orientation. Each move targets an exact 90-degree turn, while SLERP fills in the smooth frames between positions. At the end, the cube settles on its target orientation; if the arriving face is sideways, an additional whole-cube correction brings it upright. The animation can feel fluid without leaving the geometry approximate.",
      },
      {
        heading: "Make ordinary UI work inside it",
        body: "The cube determines each face's size, so its content scales from the face instead of asking which device is displaying it. Scrolling exposed a less visible constraint: Chrome initially refused to touch-scroll Projects even though wheel scrolling and DOM hit testing worked. Moving the complete Projects face later in the cube's DOM order restored touch scrolling in testing. Spatial UI still depends on ordinary DOM and browser compositing decisions.",
      },
    ],
    tags: ["React", "TypeScript", "CSS 3D", "Quaternions"],
  },
  {
    id: "horizon-parkinsons-law",
    index: "02",
    category: "PRODUCT RULES",
    status: "IN PROGRESS",
    title: "Building Horizon around Parkinson's Law",
    summary:
      "Work tends to expand to fill the time available. Horizon explores what happens when planning capacity is deliberately constrained instead.",
    sections: [
      {
        heading: "Decide before the day begins",
        body: "The idea is to prepare tomorrow's tasks ahead of time. That moves the act of choosing work away from the moment when it is time to do it. The daily list should be a boundary, not a place to keep adding items whenever the day starts to feel crowded.",
      },
      {
        heading: "Turn consistency into rules",
        body: "The product design gradually increases how many tasks a user can assign as they stay consistent. A broken streak reduces that capacity again. I am also exploring a stricter Ultra Mode for people who want a firmer limit. Missed days, partial completion, and recovery need explicit state transitions, not just a streak graphic.",
      },
      {
        heading: "Keep time moving when the app is closed",
        body: "The backend design tracks relative day numbers internally, while people can see ordinary dates. A server-side midnight engine is intended to advance the day and evaluate streaks even when no client is open. That keeps progression from depending on an app launch or a device clock.",
      },
      {
        heading: "Connect the pieces",
        body: "I am working through how Firebase Authentication, Node.js and Express APIs, and MongoDB with Mongoose can express those rules for the frontend. The difficult part is deciding which state belongs on the server and making each day transition predictable. Those implementation decisions are still in progress.",
      },
    ],
    tags: ["Product design", "Firebase Auth", "Express", "MongoDB"],
  },
  {
    id: "local-gaming-cafe",
    index: "03",
    category: "SYSTEM DESIGN",
    status: "EXPLORATION",
    title: "Designing a local gaming café control system",
    summary:
      "I am exploring a café management system that can run its essential sessions on the café's own network.",
    sections: [
      {
        heading: "A session is more than a timer",
        body: "A customer would log into an individual gaming PC and might receive a timed session. An administrator could also authorize a session without a time limit. While a session is active, the machine should work like a normal gaming PC, including legitimate companion applications. The restriction belongs at the session boundary, not as a constant interruption.",
      },
      {
        heading: "Design for expiration, not just display",
        body: "A fullscreen countdown would be easy to draw, but it would not reliably restrict access. Switching applications, closing a window, or changing the management client are obvious ways around a purely visual lock. I am treating Windows-level enforcement and protection of the client as architecture questions, rather than assuming an overlay can provide those guarantees.",
      },
      {
        heading: "Keep the control plane local",
        body: "An administrator machine could assign sessions and manage PCs over the café LAN. Keeping essential state and commands local would reduce external infrastructure needs and keep core operation available during an internet outage. It also raises questions about authenticated commands, machine restarts, and local network interruptions.",
      },
      {
        heading: "What still needs proving",
        body: "Before calling this a product, I would test expiration across app switches, reconnects, restarts, and sessions without timers. This remains a system-design exploration. The goal is to understand which boundaries actually hold beyond the happy path.",
      },
    ],
    tags: ["Local network", "Windows", "Session control", "Security boundaries"],
  },
];

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
      <header className="blogHeader">
        <div className="blogMeta">
          <span>BLOG <span aria-hidden="true">/</span> 04</span>
          <span>ENGINEERING NOTES · BUILD LOG</span>
        </div>
        <h1 id="blog-title">Notes from the build.</h1>
        <p>Decisions, experiments, and the work behind the things I make.</p>
      </header>

      <div className="blogPosts">
        {posts.map((post) => (
          <article className="blogPost" key={post.id} aria-labelledby={`${post.id}-title`}>
            <div className="blogPostMeta">
              <span>{post.index} / {post.category}</span>
              <span>{post.status}</span>
            </div>
            <h2 id={`${post.id}-title`}>{post.title}</h2>
            <p className="blogPostSummary">{post.summary}</p>
            <div className="blogPostBody">
              {post.sections.map((section) => (
                <section className="blogPostSection" key={section.heading}>
                  <h3>{section.heading}</h3>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
            <ul className="blogTags" aria-label={`${post.title} topics`}>
              {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <footer className="blogFooter">END OF NOTES <span aria-hidden="true">/</span> MORE TO BUILD</footer>
    </section>
  );
}
