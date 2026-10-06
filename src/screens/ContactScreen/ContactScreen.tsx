import { useEffect, useRef, useState, type FormEvent } from "react";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { siteContent } from "../../content/siteContent";
import {
  sendContactMessage,
  type ContactMessagePayload,
} from "../../services/contactService";
import "./ContactScreen.css";

type SubmissionState = "idle" | "submitting" | "success" | "error" | "cooldown";

type ContactSubmission = {
  state: SubmissionState;
  cooldownEndsAt: number | null;
  remainingCooldownMs: number;
};

const CONTACT_LAST_SENT_KEY = "sfysumit_contact_last_sent_at";
const CONTACT_COOLDOWN_MS = 10 * 60 * 1000;

const idleSubmission: ContactSubmission = {
  state: "idle",
  cooldownEndsAt: null,
  remainingCooldownMs: 0,
};

function getInitialSubmission(): ContactSubmission {
  try {
    const storedTimestamp = window.localStorage.getItem(CONTACT_LAST_SENT_KEY);
    const lastSentAt = Number(storedTimestamp);
    const now = Date.now();
    const remaining = lastSentAt + CONTACT_COOLDOWN_MS - now;

    if (storedTimestamp && Number.isFinite(lastSentAt) && lastSentAt <= now && remaining > 0) {
      return {
        state: "cooldown",
        cooldownEndsAt: lastSentAt + CONTACT_COOLDOWN_MS,
        remainingCooldownMs: remaining,
      };
    }

    if (storedTimestamp) window.localStorage.removeItem(CONTACT_LAST_SENT_KEY);
  } catch {
    // Storage can be unavailable in privacy-restricted browsing contexts.
  }

  return idleSubmission;
}

function storeLastSentAt(timestamp: number) {
  try {
    window.localStorage.setItem(CONTACT_LAST_SENT_KEY, String(timestamp));
  } catch {
    // The in-memory cooldown still prevents duplicate sends for this session.
  }
}

function clearLastSentAt() {
  try {
    window.localStorage.removeItem(CONTACT_LAST_SENT_KEY);
  } catch {
    // An unavailable store has no persisted cooldown to clear.
  }
}

type ContactScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

export default function ContactScreen({ isActive, isFirstOpen }: ContactScreenProps) {
  const [submission, setSubmission] = useState(getInitialSubmission);
  const submittingRef = useRef(false);
  const { state: submissionState, cooldownEndsAt, remainingCooldownMs } = submission;

  useEffect(() => {
    if (cooldownEndsAt === null) return;

    const updateCooldown = () => {
      const remaining = Math.max(cooldownEndsAt - Date.now(), 0);

      if (remaining > 0) {
        setSubmission({
          state: "cooldown",
          cooldownEndsAt,
          remainingCooldownMs: remaining,
        });
        return;
      }

      clearLastSentAt();
      setSubmission(idleSubmission);
    };

    const interval = window.setInterval(updateCooldown, 1000);

    return () => window.clearInterval(interval);
  }, [cooldownEndsAt]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    if (submittingRef.current || cooldownEndsAt !== null) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const values = new FormData(form);
    const payload: ContactMessagePayload = {
      name: String(values.get("name") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      company: String(values.get("company") ?? "").trim(),
      type: String(values.get("projectType") ?? ""),
      budget: String(values.get("budget") ?? "").trim(),
      timing: String(values.get("timeline") ?? ""),
      goals: String(values.get("goals") ?? "").trim(),
    };

    submittingRef.current = true;
    setSubmission({
      state: "submitting",
      cooldownEndsAt: null,
      remainingCooldownMs: 0,
    });

    try {
      const response = await sendContactMessage(payload);
      if (!response.ok) throw new Error(`Contact request failed with status ${response.status}`);

      const sentAt = Date.now();
      storeLastSentAt(sentAt);
      form.reset();
      setSubmission({
        state: "success",
        cooldownEndsAt: sentAt + CONTACT_COOLDOWN_MS,
        remainingCooldownMs: CONTACT_COOLDOWN_MS,
      });
    } catch {
      setSubmission({
        state: "error",
        cooldownEndsAt: null,
        remainingCooldownMs: 0,
      });
    } finally {
      submittingRef.current = false;
    }
  }

  const cooldownSeconds = Math.ceil(remainingCooldownMs / 1000);
  const cooldownTime = `${String(Math.floor(cooldownSeconds / 60)).padStart(2, "0")}:${String(cooldownSeconds % 60).padStart(2, "0")}`;
  const cooldownActive = cooldownEndsAt !== null;
  const submitLabel = submissionState === "submitting"
    ? siteContent.contact.submitting
    : cooldownActive
      ? siteContent.contact.cooldownButton
      : siteContent.contact.submit;

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
        <div className="contactHeadingAside">
          <span className="contactHeadingNote">{siteContent.contact.introduction}</span>
          <SocialLinks variant="compact" />
        </div>
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
          <button type="submit" disabled={submissionState === "submitting" || cooldownActive}>
            {submitLabel} <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="contactFormStatus" data-state={submissionState} role="status" aria-live="polite">
          {(submissionState === "success" || submissionState === "cooldown") && (
            <>
              <strong>{siteContent.contact.successTitle}</strong>
              <p>{siteContent.contact.successMessage[0]}<br />{siteContent.contact.successMessage[1]}</p>
              <span>{siteContent.contact.cooldownPrefix} {cooldownTime}</span>
            </>
          )}
          {submissionState === "error" && (
            <>
              <strong>{siteContent.contact.errorTitle}</strong>
              <p>{siteContent.contact.errorMessage}</p>
            </>
          )}
        </div>
      </form>
      <footer className="contactFooter"><span>{siteContent.contact.footerLeft}</span><span>{siteContent.contact.footerRight}</span></footer>
    </section>
  );
}
