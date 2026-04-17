import { useBooking } from "../components/BookingContext";

const BENEFITS = [
  {
    title: "Citire erori exactă",
    copy: "Identificăm codurile de eroare din toate modulele electronice ale mașinii, nu doar din motor.",
  },
  {
    title: "Parametri live",
    copy: "Monitorizăm valorile senzorilor în timp real pentru a observa anomalii care nu generează coduri de eroare.",
  },
  {
    title: "Înainte de achiziție",
    copy: "O diagnoză făcută înainte de cumpărarea unei mașini second hand te poate scuti de surprize costisitoare.",
  },
  {
    title: "Interpretare clară",
    copy: "Nu primești doar o listă de coduri. Primești o explicație pe care o înțelegi și o recomandare concretă.",
  },
];

const WHEN = [
  "Ai martori aprinși pe bord (check engine, DPF, ABS, ESP etc.)",
  "Simți pierdere de putere, trepidații sau comportament ciudat",
  "Pornirea mașinii este greoaie sau nesigură",
  "Consumul a crescut fără o explicație clară",
  "Vrei să cumperi o mașină și vrei o verificare serioasă înainte",
  "Ai făcut o reparație și vrei să te asiguri că totul e în regulă",
];

export default function Diagnoza() {
  const { open } = useBooking();

  return (
    <>
      {/* Hero */}
      <section className="page-hero section">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div className="page-hero-content" data-reveal>
          <span className="eyebrow">Diagnoză auto</span>
          <h1>
            Verificare <span className="gradient-text">înainte de orice decizie</span>
          </h1>
          <p className="page-hero-text">
            O diagnoză bine făcută nu înseamnă doar „citire cu tester-ul". Înseamnă
            interpretare corectă, context tehnic și recomandări care chiar te ajută.
          </p>
          <button type="button" className="btn btn-primary btn-lg" onClick={() => open("diagnoza")}>
            Programează diagnoză
          </button>
        </div>

        <div className="page-hero-image" data-reveal>
          <div className="image-card image-card-hero">
            <img
              src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=800&q=80"
              alt="Diagnoză auto profesionistă"
            />
          </div>
        </div>
      </section>

      {/* What is */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Ce este diagnoza auto?</span>
          <h2>Mai mult decât un tester și un cod de eroare.</h2>
          <p>
            Diagnoza computerizată presupune conectarea la unitatea de control a mașinii (ECU)
            și citirea tuturor informațiilor disponibile: coduri de eroare active și memorate,
            valori live ale senzorilor, starea actuatoarelor, istoricul de funcționare.
          </p>
          <p>
            La CLT folosim interfețe profesionale și interpretăm fiecare cod în contextul
            mașinii tale — model, motor, kilometri, simptome. Nu doar îți spunem „ai eroare P0420",
            ci îți explicăm ce înseamnă, de unde vine și ce poți face.
          </p>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Ce primești</span>
          <h2>Diagnoză cu rezultat clar, nu cu coduri aruncate.</h2>
        </div>

        <div className="benefit-grid">
          {BENEFITS.map((b) => (
            <article className="benefit-card card" key={b.title} data-reveal>
              <h3>{b.title}</h3>
              <p>{b.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* When to come */}
      <section className="section" data-reveal>
        <div className="content-block">
          <span className="eyebrow">Când ai nevoie?</span>
          <h2>Situații în care diagnoza face diferența.</h2>
          <ul className="check-list">
            {WHEN.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <h2>Vrei claritate?</h2>
            <p>Programează o diagnoză și află exact ce are mașina ta. Avans: 150 RON.</p>
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
