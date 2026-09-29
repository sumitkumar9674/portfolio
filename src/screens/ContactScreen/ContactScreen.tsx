import { useState, type FormEvent } from "react";
import "./ContactScreen.css";

export type ContactInquiry = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  goals: string;
};

type ContactScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

export default function ContactScreen({ isActive, isFirstOpen }: ContactScreenProps) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const inquiry: ContactInquiry = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      company: String(values.get("company") ?? "").trim(),
      projectType: String(values.get("projectType") ?? ""),
      budget: String(values.get("budget") ?? ""),
      timeline: String(values.get("timeline") ?? ""),
      goals: String(values.get("goals") ?? "").trim(),
    };

    // Keep a clean, typed payload ready for a future email or API handler.
    setStatus(`Brief prepared for ${inquiry.name}. Nothing has been sent.`);
  }

  return (
    <section
      className="contactScreen cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="contact-title"
    >
      <header className="contactHeading">
        <div>
          <span className="screenEyebrow">START A CONVERSATION · 06</span>
          <h1 id="contact-title">What are you working on?</h1>
        </div>
        <span className="contactHeadingNote">A little context makes for a better first conversation.</span>
      </header>

      <form className="contactForm" onSubmit={handleSubmit}>
        <div className="contactField">
          <label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" placeholder="How should I address you?" required />
        </div>
        <div className="contactField">
          <label htmlFor="contact-email">Email <span aria-hidden="true">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
        </div>
        <div className="contactField">
          <label htmlFor="contact-company">Company <span className="optionalLabel">OPTIONAL</span></label>
          <input id="contact-company" name="company" autoComplete="organization" placeholder="Your team or business" />
        </div>
        <div className="contactField">
          <label htmlFor="contact-type">What do you need? <span aria-hidden="true">*</span></label>
          <select id="contact-type" name="projectType" defaultValue="" required>
            <option value="" disabled>Select a project type</option>
            <option>Website or web app</option>
            <option>Mobile app</option>
            <option>Product design</option>
            <option>Something else</option>
          </select>
        </div>
        <div className="contactField">
          <label htmlFor="contact-budget">Approx. budget <span className="optionalLabel">OPTIONAL</span></label>
          <input id="contact-budget" name="budget" placeholder="Range and currency, if known" />
        </div>
        <div className="contactField">
          <label htmlFor="contact-timeline">Ideal timing <span className="optionalLabel">OPTIONAL</span></label>
          <select id="contact-timeline" name="timeline" defaultValue="">
            <option value="">Still exploring</option>
            <option>As soon as possible</option>
            <option>Within 1–3 months</option>
            <option>Later this year</option>
          </select>
        </div>
        <div className="contactField contactFieldWide">
          <label htmlFor="contact-goals">A little about the project <span aria-hidden="true">*</span></label>
          <textarea id="contact-goals" name="goals" placeholder="What are you hoping to make, and what would success look like?" rows={3} required />
        </div>
        <div className="contactFormActions">
          <p id="contact-form-note">No email is sent yet. This form is a preview of the future inquiry flow.</p>
          <button type="submit">Prepare project brief <span aria-hidden="true">↗</span></button>
        </div>
        <p className="contactFormStatus" role="status" aria-live="polite">{status}</p>
      </form>
      <footer className="contactFooter"><span>NO COMMITMENT · JUST A GOOD PLACE TO START</span><span>HELLO, FUTURE COLLABORATION</span></footer>
    </section>
  );
}
