import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../components/BookingContext";
import { getBrandLogoUrl, handleImageError } from "../utils/carImages";

const SERVICES = [
  {
    to: "/tuning",
    title: "Chip Tuning",
    tag: "ECU Performance",
    copy: "Stage 1, Stage 2, Eco Tuning — mapare personalizată pentru motor, kilometri și stil de condus.",
    accent: "#7c9cff",
    image: "https://www.cleanlooktuning.ro/wp-content/uploads/2016/07/remapping.jpg",
  },
  {
    to: "/diagnoza",
    title: "Diagnoză auto",
    tag: "Control electronic",
    copy: "Citire erori, parametri live și interpretare clară a simptomelor. Utilă înainte de orice intervenție.",
    accent: "#a679ff",
    image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=800&q=80",
  },
  {
    to: "/dpf",
    title: "DPF / FAP",
    tag: "Filtre particule",
    copy: "Diagnostic pentru colmatare, regenerări eșuate, pierdere de cuplu sau martori aprinși.",
    accent: "#ff9f5a",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80",
  },
  {
    to: "/egr",
    title: "Probleme EGR",
    tag: "Admisie & emisii",
    copy: "Identifici cauza reală a disfuncțiilor EGR: depuneri, senzori, comportament în mers.",
    accent: "#5cf2d6",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80",
  },
];

const TRUST = [
  { value: "10+", title: "ani experiență", copy: "Echipă dedicată, multă practică pe electronică și performanță auto." },
  { value: "OEM", title: "softuri originale", copy: "Unelte profesionale, fără compromisuri sau improvizații." },
  { value: "1-2h", title: "durată tipică", copy: "Majoritatea intervențiilor se finalizează în aceeași zi." },
  { value: "7", title: "locații active", copy: "Bacău, Bârlad, Iași, Neamț, Onești, Suceava, Vaslui." },
];

export default function Home() {
  const { open } = useBooking();
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selBrand, setSelBrand] = useState('');
  const [selModel, setSelModel] = useState('');

  useEffect(() => {
    fetch('/api/configurator/brands')
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setModels([]);
    setSelModel('');
    if (!selBrand) return;
    fetch(`/api/configurator/brands/${selBrand}/models`)
      .then((r) => r.json())
      .then((d) => setModels(d.models || []))
      .catch(() => {});
  }, [selBrand]);

  function goToConfigurator() {
    const params = new URLSearchParams();
    if (selBrand) params.set('marca', selBrand);
    if (selModel) params.set('model', selModel);
    navigate(`/configurator${params.toString() ? '?' + params.toString() : ''}`);
  }

  return (
    <>
      {/* HERO */}
      <section className="hero section">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="ambient ambient-three" />

        <div className="hero-copy" data-reveal>
          <span className="eyebrow">Performance Lab &bull; 7 locații în Moldova</span>
          <h1>
            Putere curată.
            <br />
            <span className="gradient-text">Rezultat imediat.</span>
          </h1>
          <p className="hero-text">
            Chip tuning profesionist, diagnoză exactă și soluții reale pentru DPF, EGR
            și tot ce ține de electronică auto. Programare simplă, intervenție rapidă.
          </p>

          <div className="hero-actions">
            <a
              className="btn btn-primary btn-lg"
              href="#configurator"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Către configurator
            </a>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => open()}>
              Programează-te acum
            </button>
          </div>
        </div>

        <div className="hero-visual" data-reveal>
          <div className="dashboard card">
            <div className="dashboard-topline">
              <span className="chip chip-accent">ECU custom</span>
              <span className="chip chip-muted">Diagnoză live</span>
            </div>
            <div className="visual-stack">
              <div className="image-card image-card-primary">
                <img
                  src="https://www.cleanlooktuning.ro/wp-content/uploads/2016/07/remapping.jpg"
                  alt="Chip tuning pentru performanță"
                />
                <div className="image-copy">
                  <span>Stage 1 / Stage 2 / Eco</span>
                  <strong>Răspuns instant, performanță reală</strong>
                </div>
              </div>
              <div className="image-card image-card-secondary">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80"
                  alt="Performance auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee-strip" aria-label="Servicii">
        <div className="marquee-track">
          {["Chip Tuning", "Stage 1", "Stage 2", "Eco Tuning", "Diagnoză", "DPF / FAP", "Probleme EGR", "7 locații", "Programare instant"]
            .flatMap((t) => [t, t])
            .map((item, i) => (
              <span className="marquee-pill" key={`${item}-${i}`}>{item}</span>
            ))}
        </div>
      </section>

      {/* CONFIGURATOR SEARCH — prominent, right after hero */}
      <section className="section" id="configurator" data-reveal>
        <div className="section-heading">
          <span className="eyebrow">Configurator</span>
          <h2>Cauta specificatiile masinii tale.</h2>
          <p>
            Alege marca si modelul pentru a vedea castigul de putere disponibil
            prin chip tuning Stage 1.
          </p>
        </div>

        <div className="home-cfg-bar card">
          <div className="home-cfg-fields">
            <div className="cfg-field">
              <span>Marca</span>
              <select
                value={selBrand}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelBrand(val);
                  if (val) navigate(`/configurator?marca=${val}`);
                }}
              >
                <option value="">Alege marca</option>
                {brands.map((b) => (
                  <option key={b.slug} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="cfg-field">
              <span>Model</span>
              <select
                value={selModel}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelModel(val);
                  if (val && selBrand) navigate(`/configurator?marca=${selBrand}&model=${val}`);
                }}
                disabled={!selBrand}
              >
                <option value="">Alege modelul</option>
                {models.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name} ({m.years})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={goToConfigurator}
          >
            Cauta
          </button>
        </div>

        {/* Brand grid - quick access */}
        {brands.length > 0 && (
          <div className="cfg-brand-grid home-brand-grid" style={{ marginTop: '20px' }}>
            {brands.slice(0, 12).map((b) => (
              <Link
                key={b.slug}
                to={`/configurator?marca=${b.slug}`}
                className="cfg-brand-card card"
              >
                <img
                  className="cfg-brand-logo"
                  src={getBrandLogoUrl(b.slug)}
                  alt={b.name}
                  onError={handleImageError}
                />
                <span className="cfg-brand-name">{b.name}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="home-cfg-link">
          <Link to="/configurator" className="card-link">
            Vezi toate marcile si modelele &rarr;
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="section" data-reveal>
        <div className="hero-stat-grid">
          <article className="stat-card card">
            <strong>25-35%</strong>
            <span>potențial extra pe motoare turbo*</span>
          </article>
          <article className="stat-card card">
            <strong>8-12%</strong>
            <span>potențial extra pe aspirate*</span>
          </article>
          <article className="stat-card card">
            <strong>15%</strong>
            <span>economie posibilă Eco Tuning</span>
          </article>
        </div>
        <p className="hero-footnote">
          * Valorile depind de motor, stare tehnică și mod de exploatare.
        </p>
      </section>

      {/* SERVICES */}
      <section className="section" data-reveal>
        <div className="section-heading">
          <span className="eyebrow">Servicii</span>
          <h2>Tot ce ai nevoie, într-un singur atelier.</h2>
          <p>
            De la chip tuning custom la diagnoză profesionistă, filtre de particule și circuitul EGR
            — fiecare serviciu cu abordare clară și rezultat măsurabil.
          </p>
        </div>

        <div className="service-grid">
          {SERVICES.map((svc) => (
            <Link
              to={svc.to}
              className="service-card card"
              key={svc.title}
              data-reveal
              style={{ "--accent": svc.accent }}
            >
              <div className="service-media">
                <img src={svc.image} alt={svc.title} loading="lazy" />
              </div>
              <div className="service-body">
                <span className="service-tag">{svc.tag}</span>
                <h3>{svc.title}</h3>
                <p>{svc.copy}</p>
                <span className="card-link">Află mai mult &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="section" data-reveal>
        <div className="section-heading">
          <span className="eyebrow">De ce CLT</span>
          <h2>Experiență, echipament profesional, contact direct.</h2>
        </div>

        <div className="trust-grid">
          {TRUST.map((t) => (
            <article className="trust-card card" key={t.title} data-reveal>
              <strong>{t.value}</strong>
              <h3>{t.title}</h3>
              <p>{t.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <span className="eyebrow">Gata de drum?</span>
            <h2>Programează-te în câteva secunde.</h2>
            <p>
              Alegi serviciul, locația, data și plătești avansul online.
              Simplu, rapid, fără mesaje pierdute.
            </p>
          </div>
          <div className="cta-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => open()}>
              Programare online
            </button>
            <a className="btn btn-secondary btn-lg" href="tel:+40754301560">
              0754 301 560
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
