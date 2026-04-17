import { useBooking } from "../components/BookingContext";

const PROBLEMS = [
  {
    title: "Depuneri de carbon",
    copy: "Gazele recirculate conțin particule care se depun pe supapa EGR, pe galeria de admisie și pe valve.",
  },
  {
    title: "Supapă blocată deschis",
    copy: "Motorul primește permanent gaze arse, pierde putere, merge sacadat și consumă mai mult.",
  },
  {
    title: "Supapă blocată închis",
    copy: "Emisiile cresc, ECU-ul generează coduri de eroare, iar mașina poate intra în mod limitat.",
  },
  {
    title: "Senzor de poziție defect",
    copy: "ECU-ul nu știe în ce poziție este supapa și aplică strategii de siguranță care afectează mersul.",
  },
];

const SYMPTOMS = [
  "Check engine aprins cu coduri P0400-P0409 sau similare",
  "Pierdere de putere mai ales la accelerare din turații mici",
  "Mers sacadat, neuniform sau cu trepidații",
  "Consum de combustibil crescut inexplicabil",
  "Fum negru sau cenușiu la evacuare",
  "Miros neplăcut de gaze arse în habitaclu",
];

export default function EGR() {
  const { open } = useBooking();

  return (
    <>
      {/* Hero */}
      <section className="page-hero section">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div className="page-hero-content" data-reveal>
          <span className="eyebrow">Probleme EGR</span>
          <h1>
            EGR — <span className="gradient-text">cauze reale, soluții clare</span>
          </h1>
          <p className="page-hero-text">
            Supapa EGR este una dintre cele mai problematice componente ale motoarelor diesel
            moderne. Identificăm cauza, nu doar stingem martorul.
          </p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => open("diagnoza")}>
            Programează diagnoză EGR
          </button>
        </div>

        <div className="page-hero-image" data-reveal>
          <div className="image-card image-card-hero">
            <img
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80"
              alt="Diagnoză EGR"
            />
          </div>
        </div>
      </section>

      {/* What is EGR */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Ce este EGR?</span>
          <h2>Recircularea gazelor de eșapament — utilă în teorie, problematică în practică.</h2>
          <p>
            EGR (Exhaust Gas Recirculation) este un sistem care redirecționează o parte din
            gazele de evacuare înapoi în admisie, reducând temperatura de ardere și, implicit,
            emisiile de NOx. Pe hârtie, un sistem inteligent. În practică, cauza numărul unu
            de depuneri de carbon în admisie, probleme de mers și cheltuieli neprevăzute.
          </p>
          <p>
            Majoritatea problemelor EGR apar la mașinile folosite predominant urban, cu
            trasee scurte și turații mici — exact condițiile care nu permit arderea completă
            a depunerilor.
          </p>
        </div>
      </section>

      {/* Problems grid */}
      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Probleme frecvente</span>
          <h2>Ce se defectează la circuitul EGR?</h2>
        </div>

        <div className="benefit-grid">
          {PROBLEMS.map((p) => (
            <article className="benefit-card card" key={p.title} data-reveal>
              <h3>{p.title}</h3>
              <p>{p.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Symptoms */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Simptome</span>
          <h2>Cum recunoști o problemă EGR?</h2>
          <ul className="check-list">
            {SYMPTOMS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Our approach */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Abordarea CLT</span>
          <h2>Diagnostic complet, nu doar curățare pe ghicite.</h2>
          <p>
            La CLT verificăm starea efectivă a supapei EGR, valorile senzorului de poziție,
            parametrii de funcționare și logica de activare din ECU. Uneori problema e la
            supapă, alteori la senzor, la depunerile din admisie sau chiar la turbo.
          </p>
          <p>
            Recomandăm soluția potrivită: curățare, înlocuire supapă sau, dacă mașina nu
            mai este sub garanție și clientul dorește, recalibrare software a strategiei EGR
            pentru a reduce efectele negative ale recirculării.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <h2>Probleme cu EGR-ul?</h2>
            <p>Programează o diagnoză completă. Avans: 150 RON.</p>
          </div>
          <div className="cta-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => open("diagnoza")}>
              Programare diagnoză
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
