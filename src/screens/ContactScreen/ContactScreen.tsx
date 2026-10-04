import { useState, type FormEvent } from "react";
import { siteContent } from "../../content/siteContent";
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
    setStatus(`${siteContent.contact.statusBeforeName}${inquiry.name}${siteContent.contact.statusAfterName}`);
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
          <span className="screenEyebrow">{siteContent.contact.eyebrow}</span>
          <h1 id="contact-title">{siteContent.contact.heading}</h1>
        </div>
        <span className="contactHeadingNote">{siteContent.contact.introduction}</span>
      </header>

      <form className="contactForm" onSubmit={handleSubmit}>
        <div className="contactField">
          <label htmlFor="contact-name">{siteContent.contact.labels.name} <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" placeholder={siteContent.contact.placeholders.name} required />
        </div>
        <div className="contactField">
          <label htmlFor="contact-email">{siteContent.contact.labels.email} <span aria-hidden="true">*</span></label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder={siteContent.contact.placeholders.email} required />
        </div>
        <div className="contactField">
          <label htmlFor="contact-company">{siteContent.contact.labels.company} <span className="optionalLabel">{siteContent.contact.labels.optional}</span></label>
          <input id="contact-company" name="company" autoComplete="organization" placeholder={siteContent.contact.placeholders.company} />
        </div>
        <div className="contactField">
          <label htmlFor="contact-type">{siteContent.contact.labels.type} <span aria-hidden="true">*</span></label>
          <select id="contact-type" name="projectType" defaultValue="" required>
            <option value="" disabled>{siteContent.contact.placeholders.type}</option>
            {siteContent.contact.projectTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <div className="contactField">
          <label htmlFor="contact-budget">{siteContent.contact.labels.budget} <span className="optionalLabel">{siteContent.contact.labels.optional}</span></label>
          <input id="contact-budget" name="budget" placeholder={siteContent.contact.placeholders.budget} />
        </div>
        <div className="contactField">
          <label htmlFor="contact-timeline">{siteContent.contact.labels.timing} <span className="optionalLabel">{siteContent.contact.labels.optional}</span></label>
          <select id="contact-timeline" name="timeline" defaultValue="">
            <option value="">{siteContent.contact.timelines[0]}</option>
            {siteContent.contact.timelines.slice(1).map((timing) => <option key={timing}>{timing}</option>)}
          </select>
        </div>
        <div className="contactField contactFieldWide">
          <label htmlFor="contact-goals">{siteContent.contact.labels.goals} <span aria-hidden="true">*</span></label>
          <textarea id="contact-goals" name="goals" placeholder={siteContent.contact.placeholders.goals} rows={3} required />
        </div>
        <div className="contactFormActions">
          <p id="contact-form-note">{siteContent.contact.formNote}</p>
          <button type="submit">{siteContent.contact.submit} <span aria-hidden="true">↗</span></button>
        </div>
        <p className="contactFormStatus" role="status" aria-live="polite">{status}</p>
      </form>
      <footer className="contactFooter"><span>{siteContent.contact.footerLeft}</span><span>{siteContent.contact.footerRight}</span></footer>
    </section>
  );
}
