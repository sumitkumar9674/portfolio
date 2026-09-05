import SpaceDefender from "./components/SpaceDefender";
import DecodeText from "./components/DecodeText/DecodeText";
import NeonText from "./components/NeonText";
import NeonFrame from "./components/NeonFrame";
import ProfilePhoto from "./components/ProfilePhoto";

function App() {
  return (
    <div className="page">
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="topButtons">
          <button>Blog</button>
          <button>Themes</button>
          <button>Contact</button>
        </div>

        <p className="eyebrow">SUMIT KUMAR</p>

        <h1>Build. Learn. Share.</h1>

        <p className="subtitle">
          Designing thoughtful software and documenting the journey.
        </p>
      </section>

      <ProfilePhoto
        size={350}
        timings={{
          idleDuration: 5679,
          eyebrowDuration: 999,
          bulletDuration: 700,
        }}
      />

      <NeonFrame
        width="fit-content"
        height="fit-content"
        backgroundColor="#000000"
        borderColor="#00ffff"
        cornerColor="#ffad00"
        borderWidth={6}
        cornerWidth={6}
        cornerRadius={18}
        initialDelay={500}
        sideDuration={250}
        glowStrength={0.8}
        shadowStrength={0.8}
      >
        <h2
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "48px",
          }}
        >
          SYSTEM ONLINE
        </h2>
      </NeonFrame>

      {/* <div style={{ width: "100%" }}>
        <NeonText
          text=" I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step.  I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step.  I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step.  I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step."
          fontFamily="Arial"
          fontSize={16}
          textColor="#00ffff"
          backgroundColor="#000000"
          initialDelay={300}
          flickerDuration={700}
          flickerSpeed={67}
        />
      </div> */}

      {/* <div style={{ width: "1100px" }}>
        <DecodeText
          text="At 02:17 AM, the station lights suddenly turned RED. Alex looked through the glass and saw a small ship At 02:17 AM, the station lights suddenly turned RED. Alex looked through the glass and saw a small ship At 02:17 AM, the station lights suddenly turned RED. Alex looked through the glass and saw a small ship "
          // text="Stick For You"
          fontFamily="Arial"
          fontSize="40px"
          borderColor="#431616"
          rotationStartDelay={7}
          rotationSpeed={10}
          resolveStartDelay={200}
          resolveDelay={9}
        />
      </div> */}
      {/* <DecodeText02
        text="At 02:17 AM, the station lights suddenly turned RED. Alex looked through the glass and saw a small ship drifting silently beyond the stars. Is anyone out there? he whispered. A message appeared on the console: RUN-07 // SIGNAL FOUND! He pressed ENTER, and the screen replied, WELCOME, PILOT. I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step. At 02:17 AM, the station lights suddenly turned RED. Alex looked through the glass and saw a small ship drifting silently beyond the stars. Is anyone out there? he whispered. A message appeared on the console: RUN-07 // SIGNAL FOUND! He pressed ENTER, and the screen replied, WELCOME, PILOT. I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step. At 02:17 AM, the station lights suddenly turned RED. Alex looked through the glass and saw a small ship drifting silently beyond the stars. Is anyone out there? he whispered. A message appeared on the console: RUN-07 // SIGNAL FOUND! He pressed ENTER, and the screen replied, WELCOME, PILOT. I'm currently building Horizon, a productivity app inspired by a problem I've struggled with myself—the hardest part is rarely the work, it's taking the first step."
        fontFamily="Arial"
        borderColor="#431616"
        clockInterval={7}
        rotationSpeed={20}
      /> */}

      <div style={{ maxWidth: "100%", margin: "40px auto" }}>
        <SpaceDefender />
      </div>

      {/* ---------- Current Mission ---------- */}
      <NeonFrame
        width="fit-content"
        height="fit-content"
        backgroundColor="#ffffff"
        borderColor="#00ffff"
        cornerColor="#ffad00"
        borderWidth={6}
        cornerWidth={6}
        cornerRadius={18}
        initialDelay={500}
        sideDuration={250}
        glowStrength={0.8}
        shadowStrength={0.8}
      >
        <section className="card">
          <span className="tag blue">Current Mission</span>

          <h2>Building Horizon</h2>

          <p>
            I'm currently building Horizon, a productivity app inspired by a
            problem I've struggled with myself—the hardest part is rarely the
            work, it's taking the first step.
          </p>

          <p>
            The idea came from a simple observation: we often stretch a task to
            fill all the time we give it. Horizon is my ongoing experiment in
            designing a calmer way to begin.
          </p>
        </section>
      </NeonFrame>

      {/* ---------- About ---------- */}

      <NeonFrame
        width="fit-content"
        height="fit-content"
        backgroundColor="#ffffff"
        borderColor="#00ffff"
        cornerColor="#ffad00"
        borderWidth={6}
        cornerWidth={6}
        cornerRadius={18}
        initialDelay={500}
        sideDuration={250}
        glowStrength={0.8}
        shadowStrength={0.8}
      >
        <section className="card">
          <span className="tag purple">About Me</span>

          <h2>Who I Am</h2>

          <p>
            I'm a developer who enjoys understanding how things work. Most of my
            time is spent exploring new technologies, building side projects,
            and experimenting with ideas that solve everyday problems.
          </p>

          <p>
            I care deeply about user experience and enjoy creating interfaces
            that feel calm, visually clean, and intuitive.
          </p>

          <p>
            Outside of software, I spend a lot of time reading about emerging
            technologies and physics research simply because I'm curious about
            how the world works.
          </p>
        </section>
      </NeonFrame>

      {/* ---------- Projects ---------- */}
      <section className="card">
        <span className="tag orange">Things I'm Building</span>

        <h2>Current Projects</h2>

        <div className="projectGrid">
          <div className="project">
            <h3>Horizon</h3>
            <p>Helping procrastinators take the first step.</p>
          </div>

          <div className="project">
            <h3>DesignLab</h3>
            <p>A growing collection of reusable UI components.</p>
          </div>

          <div className="project">
            <h3>Coming Soon</h3>
            <p>The next idea is already on the drawing board.</p>
          </div>
        </div>
      </section>

      {/* ---------- Blogs ---------- */}
      <section className="card">
        <span className="tag green">Latest Writing</span>

        <h2>Blog Preview</h2>

        <div className="blog">
          <h3>Why Most Productivity Apps Fail Procrastinators</h3>
          <small>5 min read • Draft</small>
        </div>

        <div className="blog">
          <h3>Building Horizon From Scratch</h3>
          <small>8 min read • Draft</small>
        </div>

        <div className="blog">
          <h3>Designing Components Before Products</h3>
          <small>4 min read • Draft</small>
        </div>

        <button className="fullButton">View All Blogs</button>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="contact">
        <span className="tag red">Let's Connect</span>

        <h2>I'd love to hear from you.</h2>

        <p>
          Whether it's a job opportunity, a product idea, or a collaboration,
          feel free to reach out.
        </p>

        <div className="socialGrid">
          <button>GitHub</button>
          <button>X</button>
          <button>Reddit</button>
          <button>Instagram</button>
        </div>

        <button className="contactButton">Contact Me</button>

        <small>
          Later this will open a contact modal connected to GoDaddy email.
        </small>
      </section>

      {/* ---------- Footer ---------- */}
      <footer>Currently building Horizon from Jaipur, India.</footer>
    </div>
  );
}

export default App;
