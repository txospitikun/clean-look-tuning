import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBrandLogoUrl, getCarImageUrl, handleImageError } from '../utils/carImages';

const API = '/api/configurator';

export default function Configurator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [modelFamily, setModelFamily] = useState('');

  const selectedBrand = searchParams.get('marca') || '';
  const selectedModel = searchParams.get('model') || '';

  // Fetch brands on mount
  useEffect(() => {
    fetch(`${API}/brands`)
      .then((r) => r.json())
      .then(setBrands)
      .catch(() => {});
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    setModels([]);
    setEngines([]);
    setBrandName('');
    setModelFamily('');
    if (!selectedBrand) return;
    setLoading(true);
    fetch(`${API}/brands/${selectedBrand}/models`)
      .then((r) => r.json())
      .then((data) => {
        setModels(data.models || []);
        setBrandName(data.brand || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedBrand]);

  // Fetch engines when model changes
  useEffect(() => {
    setEngines([]);
    setModelFamily('');
    if (!selectedBrand || !selectedModel) return;
    setLoading(true);
    fetch(`${API}/brands/${selectedBrand}/models/${selectedModel}/engines`)
      .then((r) => r.json())
      .then((data) => {
        setEngines(data.engines || []);
        setModelFamily(data.modelFamily || '');
        // Also set brandName from engines response in case models fetch hasn't returned yet
        if (data.brand) setBrandName(data.brand);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedBrand, selectedModel]);

  function handleBrand(e) {
    const val = e.target.value;
    setSearchParams(val ? { marca: val } : {});
  }

  function handleModel(e) {
    const val = e.target.value;
    if (val) {
      setSearchParams({ marca: selectedBrand, model: val });
    } else {
      setSearchParams({ marca: selectedBrand });
    }
  }

  const brandObj = brands.find((b) => b.slug === selectedBrand);
  const modelObj = models.find((m) => m.slug === selectedModel);

  const [visibleCount, setVisibleCount] = useState(8);
  const [engineFilter, setEngineFilter] = useState('');

  // Reset visible count and filter when engines change
  useEffect(() => {
    setVisibleCount(8);
    setEngineFilter('');
  }, [engines]);

  // Filter engines by search term
  const filterLower = engineFilter.toLowerCase().trim();
  const filteredEngines = filterLower
    ? engines.filter((e) =>
        e.name.toLowerCase().includes(filterLower) ||
        e.fuel.toLowerCase().includes(filterLower) ||
        e.ecu.toLowerCase().includes(filterLower) ||
        String(e.hp).includes(filterLower)
      )
    : engines;

  const dieselEngines = filteredEngines.filter((e) => e.fuel === 'Diesel');
  const petrolEngines = filteredEngines.filter((e) => e.fuel === 'Benzina');

  // Paginate: diesel first, then petrol, cap at visibleCount
  const allOrdered = [...dieselEngines, ...petrolEngines];
  const hasMore = allOrdered.length > visibleCount;
  const visibleDiesel = dieselEngines.slice(0, Math.max(0, visibleCount));
  const remainingSlots = visibleCount - visibleDiesel.length;
  const visiblePetrol = petrolEngines.slice(0, Math.max(0, remainingSlots));

  return (
    <>
      {/* HERO */}
      <section className="page-hero section">
        <div className="page-hero-content" data-reveal>
          <span className="eyebrow">Configurator Chip Tuning</span>
          <h1>
            Afla ce performanta
            <br />
            <span className="gradient-text">poti obtine.</span>
          </h1>
          <p className="page-hero-text">
            Alege marca, modelul si motorizarea masinii tale pentru a vedea
            castigul de putere si cuplu disponibil prin Stage 1.
          </p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="section cfg-search-section" data-reveal>
        <div className="cfg-search-bar card">
          <div className="cfg-field">
            <span>Marca</span>
            <select value={selectedBrand} onChange={handleBrand}>
              <option value="">Alege marca</option>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="cfg-field">
            <span>Model</span>
            <select
              value={selectedModel}
              onChange={handleModel}
              disabled={!selectedBrand}
            >
              <option value="">Alege modelul</option>
              {models.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name} ({m.years})
                </option>
              ))}
            </select>
          </div>

          <div className="cfg-field cfg-field-info">
            {loading && <span className="cfg-loading">Se incarca...</span>}
            {!loading && selectedModel && engines.length > 0 && (
              <div className="cfg-filter-wrap">
                <span className="cfg-filter-label">
                  {filterLower && filteredEngines.length !== engines.length
                    ? `${filteredEngines.length} din ${engines.length} motorizari`
                    : `${engines.length} motorizari disponibile`
                  }
                </span>
                <input
                  type="text"
                  className="cfg-filter-input"
                  placeholder="Cauta motor, CP, ECU..."
                  value={engineFilter}
                  onChange={(e) => {
                    setEngineFilter(e.target.value);
                    setVisibleCount(8);
                  }}
                />
              </div>
            )}
            {!loading && !selectedBrand && (
              <span className="cfg-hint">Selecteaza marca pentru a incepe</span>
            )}
            {!loading && selectedBrand && !selectedModel && models.length > 0 && (
              <span className="cfg-hint">Selecteaza modelul</span>
            )}
          </div>
        </div>
      </section>

      {/* BRAND GRID (when no brand selected) */}
      {!selectedBrand && brands.length > 0 && (
        <section className="section" data-reveal>
          <div className="section-heading">
            <h2>Toate marcile disponibile</h2>
            <p>Selecteaza marca masinii tale din lista de mai jos.</p>
          </div>
          <div className="cfg-brand-grid">
            {brands.map((b) => (
              <button
                key={b.slug}
                type="button"
                className="cfg-brand-card card"
                onClick={() => setSearchParams({ marca: b.slug })}
              >
                <img
                  className="cfg-brand-logo"
                  src={getBrandLogoUrl(b.slug)}
                  alt={b.name}
                  onError={handleImageError}
                />
                <span className="cfg-brand-name">{b.name}</span>
                <span className="cfg-brand-count">{b.modelCount} modele</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ENGINE RESULTS */}
      {engines.length > 0 && (
        <section className="section" data-reveal>
          <div className="section-heading">
            <span className="eyebrow">
              {brandObj?.name} {modelObj?.name}
            </span>
            <h2>Motorizari si performante Stage 1</h2>
            <p>
              Valorile afisate sunt orientative. Rezultatul final depinde de
              starea tehnica a vehiculului.
            </p>
          </div>

          {/* Car image */}
          {brandName && modelFamily && (
            <div className="cfg-car-image-wrap">
              <img
                className="cfg-car-image"
                src={getCarImageUrl(brandName, modelFamily)}
                alt={`${brandName} ${modelObj?.name || ''}`}
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {visibleDiesel.length > 0 && (
            <>
              <h3 className="cfg-fuel-heading">Diesel</h3>
              <div className="cfg-engine-grid">
                {visibleDiesel.map((eng) => (
                  <EngineCard
                    key={eng.slug}
                    engine={eng}
                    brandSlug={selectedBrand}
                    modelSlug={selectedModel}
                  />
                ))}
              </div>
            </>
          )}

          {visiblePetrol.length > 0 && (
            <>
              <h3 className="cfg-fuel-heading">Benzina</h3>
              <div className="cfg-engine-grid">
                {visiblePetrol.map((eng) => (
                  <EngineCard
                    key={eng.slug}
                    engine={eng}
                    brandSlug={selectedBrand}
                    modelSlug={selectedModel}
                  />
                ))}
              </div>
            </>
          )}

          {hasMore && (
            <div className="cfg-show-more">
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => setVisibleCount((c) => c + 8)}
              >
                Arata mai multe ({allOrdered.length - visibleCount} ramase)
              </button>
            </div>
          )}
        </section>
      )}

      {/* NO RESULTS */}
      {!loading && selectedModel && engines.length === 0 && (
        <section className="section" data-reveal>
          <div className="cfg-empty card">
            <p>Nu am gasit motorizari pentru aceasta selectie.</p>
          </div>
        </section>
      )}

      {/* NO FILTER RESULTS */}
      {!loading && selectedModel && engines.length > 0 && filteredEngines.length === 0 && (
        <section className="section" data-reveal>
          <div className="cfg-empty card">
            <p>Nicio motorizare nu corespunde cautarii &ldquo;{engineFilter}&rdquo;.</p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: '12px' }}
              onClick={() => setEngineFilter('')}
            >
              Reseteaza cautarea
            </button>
          </div>
        </section>
      )}
    </>
  );
}

function EngineCard({ engine, brandSlug, modelSlug }) {
  const hpGain = engine.stage1.hp - engine.hp;
  const nmGain = engine.stage1.nm - engine.nm;
  const hpPercent = Math.round((hpGain / engine.hp) * 100);

  return (
    <Link
      to={`/configurator/${brandSlug}/${modelSlug}/${engine.slug}`}
      className="cfg-engine-card card"
    >
      <div className="cfg-engine-header">
        <strong className="cfg-engine-name">{engine.name}</strong>
        <span className="cfg-engine-fuel">{engine.fuel}</span>
      </div>

      <div className="cfg-engine-specs">
        <div className="cfg-spec-row">
          <span className="cfg-spec-label">Putere originala</span>
          <span className="cfg-spec-value">{engine.hp} CP</span>
        </div>
        <div className="cfg-spec-row">
          <span className="cfg-spec-label">Cuplu original</span>
          <span className="cfg-spec-value">{engine.nm} NM</span>
        </div>
        <div className="cfg-spec-row">
          <span className="cfg-spec-label">ECU</span>
          <span className="cfg-spec-value cfg-spec-ecu">{engine.ecu}</span>
        </div>
      </div>

      <div className="cfg-engine-stage1">
        <div className="cfg-stage1-row">
          <span>Stage 1</span>
          <strong className="cfg-stage1-hp">{engine.stage1.hp} CP</strong>
          <span className="cfg-gain">+{hpGain} CP ({hpPercent}%)</span>
        </div>
        <div className="cfg-stage1-row">
          <span>Cuplu</span>
          <strong className="cfg-stage1-nm">{engine.stage1.nm} NM</strong>
          <span className="cfg-gain">+{nmGain} NM</span>
        </div>
      </div>

      <div className="cfg-engine-footer">
        <span className="cfg-price">{engine.price} EUR</span>
        <span className="card-link">Vezi detalii &rarr;</span>
      </div>
    </Link>
  );
}
