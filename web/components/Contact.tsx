import type { Contact as ContactData } from "@/data/portfolio";
import CopyEmailButton from "./CopyEmailButton";
import Icon from "./Icon";

/** "(314) 974-1178" -> "+13149741178" (assumes a US number unless it starts with +). */
function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return "tel:" + (digits.startsWith("+") ? digits : "+1" + digits);
}

/** 4. Contact. Empty values are left out. */
export default function Contact({ contact, subtitle }: { contact: ContactData; subtitle: string }) {
  const links = contact.links.filter((l) => l.url);

  return (
    <section className="section section--alt" id="contact" aria-labelledby="contact-title">
      <div className="container contact">
        <header className="section__header reveal">
          <h2 className="section__title" id="contact-title">
            Contact
          </h2>
          <p className="section__subtitle">{subtitle}</p>
        </header>

        {contact.email && (
          <div className="contact__email reveal">
            <a className="btn btn--primary btn--lg" href={"mailto:" + contact.email}>
              Email Me
            </a>
            <CopyEmailButton email={contact.email} />
          </div>
        )}

        <ul className="contact__links reveal">
          {contact.email && (
            <li>
              <a className="contact__link" href={"mailto:" + contact.email}>
                <Icon name="email" />
                {contact.email}
              </a>
            </li>
          )}
          {contact.phone && (
            <li>
              <a className="contact__link" href={telHref(contact.phone)}>
                <Icon name="phone" />
                {contact.phone}
              </a>
            </li>
          )}
          {links.map((l) => (
            <li key={l.url}>
              <a className="contact__link" href={l.url} target="_blank" rel="noopener">
                <Icon name={l.icon} />
                {l.label}
              </a>
            </li>
          ))}
          {contact.location && (
            <li>
              <span className="contact__link">
                <Icon name="location" />
                {contact.location}
              </span>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
