import { useBooking } from "../components/BookingContext";

const LOCATIONS = [
  { city: "Iași", address: "Strada Stupinilor 33, Tomești", main: true },
  { city: "Bacău", address: "Locație parteneră Bacău" },
  { city: "Bârlad", address: "Locație parteneră Bârlad" },
  { city: "Neamț", address: "Locație parteneră Neamț" },
  { city: "Onești", address: "Locație parteneră Onești" },
  { city: "Suceava", address: "Locație parteneră Suceava" },
  { city: "Vaslui", address: "Locație parteneră Vaslui" },
];

export default function Contact() {
  const { open } = useBooking();

  return (
    <>
      {/* Hero */}
      <section className="page-hero section">
        <div className="ambient ambient-one" />

        <div className="page-hero-content" data-reveal>
          <span className="eyebrow">Contact</span>
          <h1>
            Ia legătura <span className="gradient-text">cu echipa CLT</span>
          </h1>
          <p className="page-hero-text">
            7 locații active în zona Moldovei. Programare simplă, contact direct,
            fără intermediari.
          </p>
        </div>
      </section>

      {/* Contact info */}
      <section className="section">
        <div className="contact-info-grid">
          <a className="contact-card card" href="tel:+40754301560" data-reveal>
            <span className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <strong>0754 301 560</strong>
            <span>Apelează direct</span>
          </a>

          <a className="contact-card card" href="mailto:contact@cleanlooktuning.ro" data-reveal>
            <span className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <strong>contact@cleanlooktuning.ro</strong>
            <span>Trimite email</span>
          </a>

          <div className="contact-card card" data-reveal>
            <span className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <strong>09:00 &ndash; 19:00</strong>
            <span>Luni &ndash; Vineri</span>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Locații</span>
          <h2>7 ateliere în zona Moldovei.</h2>
        </div>

        <div className="locations-grid">
          {LOCATIONS.map((loc) => (
            <article
              className={`location-card card${loc.main ? " location-main" : ""}`}
              key={loc.city}
              data-reveal
            >
              {loc.main && <span className="eyebrow">Sediu principal</span>}
              <h3>{loc.city}</h3>
              <p>{loc.address}</p>
              {loc.main && (
                <a
                  className="btn btn-secondary btn-sm"
                  href="https://www.google.com/maps/search/?api=1&query=Strada+Stupinilor+33+Tomesti+Iasi"
                  target="_blank"
                  rel="noreferrer"
                >
                  Deschide pe hartă
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <h2>Programare rapidă, fără așteptare.</h2>
            <p>Alege serviciul, locația și ziua. Totul online, în câteva secunde.</p>
          </div>
          <div className="cta-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => open()}>
              Programare online
            </button>
            <a className="btn btn-secondary btn-lg" href="tel:+40754301560">
              Sună acum
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
