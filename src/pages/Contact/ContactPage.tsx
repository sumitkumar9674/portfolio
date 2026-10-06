import ContactForm from "../../components/ContactForm/ContactForm";
import { siteContent } from "../../content/siteContent";
import "./ContactPage.css";

export default function ContactPage() {
  return (
    <main className="contactPage">
      <nav className="contactPageNav" aria-label={siteContent.contact.pageNavigationLabel}>
        <a href="#/">{siteContent.contact.pageBack}</a>
        <span>{siteContent.brand.name.toUpperCase()} <span aria-hidden="true">/</span> {siteContent.contact.pageBrandSuffix}</span>
      </nav>
      <header className="contactPageHeader">
        <p>{siteContent.contact.eyebrow}</p>
        <h1 tabIndex={-1}>{siteContent.contact.heading}</h1>
        <p>{siteContent.contact.introduction}</p>
      </header>
      <section className="contactPageForm" aria-label={siteContent.contact.heading}>
        <ContactForm />
      </section>
    </main>
  );
}
