import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../components/BookingContext';
import { getBrandLogoUrl, getCarImageUrl, handleImageError } from '../utils/carImages';

const API = '/api/configurator';

export default function VehicleDetail() {
  const { brandSlug, modelSlug, engineSlug } = useParams();
  const { open } = useBooking();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/vehicle/${brandSlug}/${modelSlug}/${engineSlug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Nu am gasit acest vehicul.');
        return r.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [brandSlug, modelSlug, engineSlug]);

  if (loading) {
    return (
      <section className="section">
        <div className="cfg-loading-page">Se incarca...</div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="section">
        <div className="cfg-error-page card">
          <h2>Vehicul negasit</h2>
          <p>{error || 'Verifica URL-ul si incearca din nou.'}</p>
          <Link to="/configurator" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Inapoi la configurator
          </Link>
        </div>
      </section>
    );
  }

  const { brand, model, engine } = data;
  const hpGain = engine.stage1.hp - engine.hp;
  const nmGain = engine.stage1.nm - engine.nm;
  const hpPercent = Math.round((hpGain / engine.hp) * 100);
  const nmPercent = Math.round((nmGain / engine.nm) * 100);

  return (
    <>
      {/* BREADCRUMB */}
      <section className="section cfg-breadcrumb-section">
        <nav className="cfg-breadcrumb" data-reveal>
          <Link to="/configurator">Configurator</Link>
          <span>/</span>
          <Link to={`/configurator?marca=${brand.slug}`}>{brand.name}</Link>
          <span>/</span>
          <Link to={`/configurator?marca=${brand.slug}&model=${model.slug}`}>
            {model.name}
          </Link>
          <span>/</span>
          <span className="cfg-breadcrumb-current">{engine.name}</span>
        </nav>
      </section>

      {/* VEHICLE HEADER */}
      <section className="section cfg-vehicle-hero" data-reveal>
        <div className="cfg-vehicle-hero-inner">
          <div className="cfg-vehicle-title">
            <img
              className="cfg-vehicle-brand-logo"
              src={getBrandLogoUrl(brand.slug)}
              alt={brand.name}
              onError={handleImageError}
            />
            <span className="eyebrow">{engine.fuel} &bull; {model.years}</span>
            <h1>
              {brand.name} {model.name}
              <br />
              <span className="gradient-text">{engine.name}</span>
            </h1>
          </div>
          <div className="cfg-vehicle-hero-image">
            <img
              className="cfg-car-image"
              src={getCarImageUrl(brand.name, model.modelFamily || model.name)}
              alt={`${brand.name} ${model.name}`}
              onError={(e) => { e.target.onerror = null; e.target.style.opacity = '0.3'; }}
            />
          </div>
        </div>
      </section>

      {/* PERFORMANCE OVERVIEW */}
      <section className="section" data-reveal>
        <div className="cfg-perf-grid">
          <div className="cfg-perf-card card">
            <span className="cfg-perf-label">Putere originala</span>
            <strong className="cfg-perf-value">{engine.hp} <small>CP</small></strong>
          </div>
          <div className="cfg-perf-card card cfg-perf-card-stage1">
            <span className="cfg-perf-label">Stage 1</span>
            <strong className="cfg-perf-value cfg-perf-stage1">{engine.stage1.hp} <small>CP</small></strong>
            <span className="cfg-perf-gain">+{hpGain} CP ({hpPercent}%)</span>
          </div>
          <div className="cfg-perf-card card">
            <span className="cfg-perf-label">Cuplu original</span>
            <strong className="cfg-perf-value">{engine.nm} <small>NM</small></strong>
          </div>
          <div className="cfg-perf-card card cfg-perf-card-stage1">
            <span className="cfg-perf-label">Cuplu Stage 1</span>
            <strong className="cfg-perf-value cfg-perf-stage1">{engine.stage1.nm} <small>NM</small></strong>
            <span className="cfg-perf-gain">+{nmGain} NM ({nmPercent}%)</span>
          </div>
        </div>
      </section>

      {/* HP BAR VISUAL */}
      <section className="section" data-reveal>
        <div className="cfg-bars-card card">
          <h3>Comparatie putere si cuplu</h3>
          <div className="cfg-bar-group">
            <div className="cfg-bar-label">
              <span>Putere (CP)</span>
            </div>
            <div className="cfg-bar-wrap">
              <div
                className="cfg-bar cfg-bar-original"
                style={{ width: `${(engine.hp / engine.stage1.hp) * 100}%` }}
              >
                <span>{engine.hp}</span>
              </div>
              <div className="cfg-bar cfg-bar-stage1" style={{ width: '100%' }}>
                <span>{engine.stage1.hp}</span>
              </div>
            </div>
          </div>
          <div className="cfg-bar-group">
            <div className="cfg-bar-label">
              <span>Cuplu (NM)</span>
            </div>
            <div className="cfg-bar-wrap">
              <div
                className="cfg-bar cfg-bar-original"
                style={{ width: `${(engine.nm / engine.stage1.nm) * 100}%` }}
              >
                <span>{engine.nm}</span>
              </div>
              <div className="cfg-bar cfg-bar-stage1" style={{ width: '100%' }}>
                <span>{engine.stage1.nm}</span>
              </div>
            </div>
          </div>
          <div className="cfg-bar-legend">
            <span className="cfg-legend-original">Original</span>
            <span className="cfg-legend-stage1">Stage 1</span>
          </div>
        </div>
      </section>

      {/* SPECS TABLE */}
      <section className="section" data-reveal>
        <div className="cfg-specs-card card">
          <h3>Specificatii tehnice</h3>
          <table className="cfg-specs-table">
            <tbody>
              <tr>
                <td>Marca</td>
                <td>{brand.name}</td>
              </tr>
              <tr>
                <td>Model</td>
                <td>{model.name}</td>
              </tr>
              <tr>
                <td>Ani fabricatie</td>
                <td>{model.years}</td>
              </tr>
              <tr>
                <td>Motor</td>
                <td>{engine.name}</td>
              </tr>
              <tr>
                <td>Combustibil</td>
                <td>{engine.fuel}</td>
              </tr>
              <tr>
                <td>Putere originala</td>
                <td>{engine.hp} CP</td>
              </tr>
              <tr>
                <td>Cuplu original</td>
                <td>{engine.nm} NM</td>
              </tr>
              <tr>
                <td>ECU</td>
                <td>{engine.ecu}</td>
              </tr>
              <tr className="cfg-specs-highlight">
                <td>Stage 1 &mdash; Putere</td>
                <td>{engine.stage1.hp} CP (+{hpGain})</td>
              </tr>
              <tr className="cfg-specs-highlight">
                <td>Stage 1 &mdash; Cuplu</td>
                <td>{engine.stage1.nm} NM (+{nmGain})</td>
              </tr>
              <tr className="cfg-specs-highlight">
                <td>Pret Stage 1</td>
                <td>{engine.price} EUR</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* DYNO PLACEHOLDER */}
      <section className="section" data-reveal>
        <div className="cfg-dyno-card card">
          <h3>Grafic Dyno</h3>
          <div className="cfg-dyno-placeholder">
            <svg width="100%" height="180" viewBox="0 0 600 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 160 Q150 140 250 100 T500 40 L600 30" stroke="rgba(124,156,255,0.3)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
              <path d="M0 160 Q150 130 250 80 T500 20 L600 10" stroke="rgba(92,242,214,0.5)" strokeWidth="2.5" fill="none" />
              <text x="570" y="40" fill="rgba(124,156,255,0.5)" fontSize="11">OEM</text>
              <text x="570" y="18" fill="rgba(92,242,214,0.7)" fontSize="11">Stage 1</text>
            </svg>
            <p className="cfg-dyno-note">
              Graficul dyno real va fi disponibil dupa efectuarea masuratorii pe standul nostru.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" data-reveal>
        <div className="cta-banner card">
          <div className="cta-content">
            <span className="eyebrow">Vrei aceste performante?</span>
            <h2>Programeaza-te pentru Stage 1.</h2>
            <p>
              Pretul de {engine.price} EUR se calculeaza in lei la cursul BNR din ziua interventiei.
              Programare simpla, rezultat garantat.
            </p>
          </div>
          <div className="cta-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => open()}
            >
              Programare online
            </button>
            <a className="btn btn-secondary btn-lg" href="tel:+40754301560">
              0754 301 560
            </a>
          </div>
        </div>
      </section>

      {/* TERMS */}
      <section className="section" data-reveal>
        <div className="cfg-terms-card card">
          <h3>Informatii importante</h3>
          <ul className="cfg-terms-list">
            <li>
              Pretul afisat este in EUR si se calculeaza in lei la cursul BNR din
              ziua efectuarii serviciului.
            </li>
            <li>
              Valorile de putere si cuplu sunt orientative si sunt valabile pentru
              autoturisme in stare tehnica perfecta, cu filtre curate si fara
              defecte mecanice.
            </li>
            <li>
              La cerere se poate realiza si Stage Low (crestere moderata) sau
              Eco Tuning (optimizare consum).
            </li>
            <li>
              Ne rezervam dreptul de a refuza vehiculele cu probleme tehnice
              majore sau modificari incompatibile.
            </li>
            <li>
              Chip tuning-ul se realizeaza exclusiv pe raspunderea proprietarului.
              Consultati <Link to="/termeni">Termenii si conditiile</Link> pentru
              detalii complete.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
