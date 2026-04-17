import { useBooking } from "../components/BookingContext";

const STAGES = [
  {
    title: "Stage 1",
    subtitle: "OEM+",
    accent: "#7c9cff",
    description: "Recomandat pentru mașini fără modificări fizice. Se respectă limitele constructorului și se potrivește celor care folosesc mașina zilnic, cu service-ul la zi.",
    bullets: [
      "Creștere de cuplu și putere în limitele sănătoase ale motorului",
      "Răspuns mai bun la accelerare, mai ales pe turbo diesel",
      "Potrivit pentru mașina de zi cu zi, fără modificări mecanice",
    ],
  },
  {
    title: "Stage 2",
    subtitle: "Track-ready",
    accent: "#ff7a9c",
    description: "Pentru cei care au sau pregătesc modificări: turbo, admisie, evacuare sau injectoare. Mapa se face în funcție de setup-ul efectiv al mașinii.",
    bullets: [
      "Mapa adaptată la modificările fizice existente",
      "Crește semnificativ peste limitele soft-ului original",
      "Recomandat doar cu componente și întreținere corespunzătoare",
    ],
  },
  {
    title: "Eco Tuning",
    subtitle: "Consum optimizat",
    accent: "#5cf2d6",
    description: "Pentru flotă, rulaj mare sau drumuri dese. Poate reduce consumul real în funcție de motor, stil de condus și traseu, fără pierdere de confort.",
    bullets: [
      "Economie tipică de 5-15% la consum real",
      "Optimizarea curbei de cuplu la turații joase",
      "Ideal pentru vehicule comerciale, cursă lungă, flotă",
    ],
  },
];

const FAQ = [
  {
    q: "Ce înseamnă chiptuning la CLT?",
    a: "Ajustarea parametrilor din ECU pentru un efect optim și personalizat, fără a depăși limitele sănătoase ale motorului. Se ține cont de vârsta mașinii, kilometri, întreținere și stilul de condus.",
  },
  {
    q: "Poți avea mai multă putere și consum mai bun?",
    a: "Da, în anumite scenarii. Cuplul mai mare la turații joase și optimizarea arderii pot reduce consumul la același stil de condus, însă exploatarea agresivă va crește consumul.",
  },
  {
    q: "Se pierde garanția producătorului?",
    a: "Răspunsul corect este da, dacă producătorul sau dealerul detectează intervenția. Un atelier serios nu promite tuning invizibil doar ca să câștige clientul.",
  },
  {
    q: "Afectează filtrul de particule?",
    a: "Nu acesta este scopul. Softul poate fi optimizat astfel încât filtrul și funcțiile de regenerare să rămână active și funcționale.",
  },
  {
    q: "Cât durează intervenția?",
    a: "Pentru cele mai multe lucrări de tuning, între 1 și 2 ore. Dacă apar verificări suplimentare, atelierul îți spune clar înainte.",
  },
];

export default function Tuning() {
  const { open } = useBooking();

  return (
    <>
      {/* Hero */}
      <section className="page-hero section">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div className="page-hero-content" data-reveal>
          <span className="eyebrow">Chip Tuning</span>
          <h1>
            Mapare ECU <span className="gradient-text">pentru performanță reală</span>
          </h1>
          <p className="page-hero-text">
            Optimizăm parametrii din unitatea de control a motorului (ECU) pentru a obține
            un răspuns mai bun, cuplu mai puternic și o experiență de condus adaptată
            ție — nu unei setări generice de fabrică.
          </p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => open("stage1")}>
            Programează Stage 1
          </button>
        </div>

        <div className="page-hero-image" data-reveal>
          <div className="image-card image-card-hero">
            <img
              src="https://www.cleanlooktuning.ro/wp-content/uploads/2016/07/remapping.jpg"
              alt="Chip tuning ECU remapping"
            />
          </div>
        </div>
      </section>

      {/* What is chiptuning */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Ce este chiptuning?</span>
          <h2>ECU-ul mașinii tale vine cu limite software impuse de fabricant.</h2>
          <p>
            Aceste limite țin cont de piețele globale, normele de emisii și costurile de garanție —
            nu de potențialul real al motorului. Chip tuning-ul ajustează hărțile de injecție,
            presiunea turbo, avansul de aprindere și alți parametri pentru a extrage performanța
            pe care motorul o are deja, dar pe care software-ul original o ține blocată.
          </p>
          <p>
            La CLT nu folosim fișiere generice. Fiecare mapare ține cont de motorul specific,
            kilometrajul, starea de întreținere și modul în care folosești mașina.
          </p>
        </div>
      </section>

      {/* Stages */}
      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Opțiuni tuning</span>
          <h2>Trei direcții clare, fără marketing vag.</h2>
        </div>

        <div className="stage-grid">
          {STAGES.map((stage) => (
            <article
              className="stage-card card"
              key={stage.title}
              data-reveal
              style={{ "--accent": stage.accent }}
            >
              <span className="stage-eyebrow">{stage.subtitle}</span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <ul className="feature-list">
                {stage.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Întrebări frecvente</span>
          <h2>Ce trebuie să știi înainte de tuning.</h2>
        </div>

        <div className="faq-list">
          {FAQ.map((item) => (
            <details className="faq-card card" key={item.q} data-reveal>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <h2>Gata pentru un upgrade?</h2>
            <p>Programează-te online, alege locația și ziua. Avansul se achită simplu, prin PayU.</p>
          </div>
          <div className="cta-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => open("stage1")}>
              Programare Tuning
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
