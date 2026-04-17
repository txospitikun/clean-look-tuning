import { useBooking } from "../components/BookingContext";

const SYMPTOMS = [
  'Martor DPF aprins pe bord sau mesaj „Filtru de particule plin"',
  "Pierdere de putere vizibilă, mai ales la accelerare",
  "Mașina intră în mod de urgență (limp mode)",
  "Regenerări frecvente sau eșuate",
  "Consum de combustibil crescut fără explicație",
  "Miros de combustibil ars sau fum la evacuare",
];

const CAUSES = [
  {
    title: "Condus urban exclusiv",
    copy: "Filtrul are nevoie de temperaturi ridicate pentru regenerare. Traseele scurte, urbane, nu permit acest lucru.",
  },
  {
    title: "Senzori defecți",
    copy: "Senzorii de temperatură sau presiune diferențială pot da informații greșite, blocând regenerarea.",
  },
  {
    title: "Ulei de motor nepotrivit",
    copy: 'Uleiul care nu respectă specificația „low-SAPS" generează cenușă excesivă și accelerează colmatarea.',
  },
  {
    title: "Injector defect sau turbo uzat",
    copy: "Un injector care picură sau un turbo cu joc trimite particule în exces în filtru, depășind capacitatea de regenerare.",
  },
];

export default function DPF() {
  const { open } = useBooking();

  return (
    <>
      {/* Hero */}
      <section className="page-hero section">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div className="page-hero-content" data-reveal>
          <span className="eyebrow">Filtre de particule</span>
          <h1>
            DPF / FAP — <span className="gradient-text">diagnoză și soluții reale</span>
          </h1>
          <p className="page-hero-text">
            Filtrul de particule este una dintre cele mai frecvente surse de probleme
            la mașinile diesel. Identificăm cauza, nu doar simptomul.
          </p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => open("diagnoza")}>
            Programează diagnoză DPF
          </button>
        </div>

        <div className="page-hero-image" data-reveal>
          <div className="image-card image-card-hero">
            <img
              src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80"
              alt="Diagnoză DPF/FAP"
            />
          </div>
        </div>
      </section>

      {/* What is DPF */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Ce este DPF / FAP?</span>
          <h2>Filtrul care curăță gazele de evacuare — dar care se poate înfunda.</h2>
          <p>
            DPF (Diesel Particulate Filter) sau FAP (Filtre à Particules) este un element
            montat pe sistemul de evacuare care reține particulele de funingine din gazele arse.
            Periodic, filtrul trece printr-un proces de regenerare — arderea particulelor acumulate
            la temperaturi de peste 600°C.
          </p>
          <p>
            Când regenerarea nu se finalizează corect sau nu se declanșează, filtrul se colmatează:
            gazele nu mai pot trece, motorul pierde putere, iar ECU-ul declanșează mod de urgență.
          </p>
        </div>
      </section>

      {/* Symptoms */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Simptome</span>
          <h2>Cum recunoști o problemă cu filtrul de particule?</h2>
          <ul className="check-list">
            {SYMPTOMS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Causes */}
      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Cauze frecvente</span>
          <h2>De ce se colmatează filtrul?</h2>
        </div>

        <div className="benefit-grid">
          {CAUSES.map((c) => (
            <article className="benefit-card card" key={c.title} data-reveal>
              <h3>{c.title}</h3>
              <p>{c.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Our approach */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Abordarea CLT</span>
          <h2>Diagnostic corect, soluție durabilă.</h2>
          <p>
            La CLT nu recomandăm eliminarea sau anularea filtrului fără să înțelegem cauza.
            Diagnostic complet al senzorilor, verificare parametri de regenerare, stare turbo,
            calitate ulei, funcționare EGR — iar apoi o recomandare clară: regenerare, curățare
            sau înlocuire, în funcție de situația reală.
          </p>
          <p>
            Accentul este mereu pe soluții curate și legale, care mențin funcționalitatea
            filtrului și respectă normele de emisii.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <h2>Probleme cu DPF-ul?</h2>
            <p>Programează o diagnoză și află cauza reală. Avans: 150 RON.</p>
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
