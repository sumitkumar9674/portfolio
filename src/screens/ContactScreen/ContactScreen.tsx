import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { siteContent } from "../../content/siteContent";
import "./ContactScreen.css";

type ContactScreenProps = {
  isActive: boolean;
  isFirstOpen: boolean;
};

export default function ContactScreen({ isActive, isFirstOpen }: ContactScreenProps) {
  const { gateway } = siteContent.contact;

  return (
    <section
      className="contactGateway cubePanel"
      data-active={isActive}
      data-first-open={isFirstOpen}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="contact-gateway-title"
    >
      <div className="contactGatewayTop">
        <span>{siteContent.contact.eyebrow}</span>
        <span aria-hidden="true">{gateway.status}</span>
      </div>

      <header className="contactGatewayIntro">
        <h1 id="contact-gateway-title">{gateway.heading}</h1>
        <p>{gateway.introduction}</p>
      </header>

      <div className="contactGatewayCategories">
        {gateway.categories.map((category) => (
          <div className="contactGatewayCategory" key={category.number}>
            <span className="contactGatewayNumber">{category.number}</span>
            <h2>{category.title}</h2>
            <p>{category.detail}</p>
          </div>
        ))}
      </div>

      <div className="contactGatewayAction">
        <a href="#/contact">{gateway.action} <span aria-hidden="true">↗</span></a>
      </div>

      <footer className="contactGatewayFooter">
        <span>{siteContent.contact.footerLeft}</span>
        <SocialLinks variant="compact" />
      </footer>
    </section>
  );
}
