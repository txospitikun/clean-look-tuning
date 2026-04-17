import { useBooking } from "./BookingContext";
import { useState } from "react";

const STEP_LABELS = [
  "Serviciu",
  "Data & Ora",
  "Date personale",
  "Confirmare",
];

export default function BookingModal() {
  const {
    isOpen,
    close,
    step,
    setStep,
    form,
    updateField,
    selectedService,
    SERVICES,
    LOCATIONS,
    TIME_SLOTS,
  } = useBooking();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const canNext = () => {
    if (step === 1) return form.service && form.location;
    if (step === 2) return form.date && form.time;
    if (step === 3)
      return form.firstName && form.lastName && form.phone && form.email && form.consent;
    return false;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: form.service,
          location: form.location,
          date: form.date,
          time: form.time,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
        }),
      });

      if (!res.ok) throw new Error("Eroare la salvarea programării");

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        // PayU not configured — show success directly
        setStep(5);
      }
    } catch (err) {
      setError(err.message || "Eroare de conexiune. Încearcă din nou.");
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Progress bar */}
        {step <= 4 && (
          <div className="modal-progress">
            {STEP_LABELS.map((label, i) => (
              <div
                key={label}
                className={`progress-step${i + 1 <= step ? " active" : ""}${i + 1 < step ? " done" : ""}`}
              >
                <span className="progress-dot">{i + 1 < step ? "✓" : i + 1}</span>
                <span className="progress-label">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Service + Location */}
        {step === 1 && (
          <div className="modal-body">
            <h2>Selectează serviciul</h2>
            <p className="modal-subtitle">Alege serviciul dorit și locația preferată.</p>

            <div className="service-select-grid">
              {SERVICES.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  className={`service-option${form.service === svc.id ? " selected" : ""}`}
                  onClick={() => updateField("service", svc.id)}
                >
                  <strong>{svc.label}</strong>
                  <span className="service-price">{svc.price} RON</span>
                </button>
              ))}
            </div>

            <label className="modal-field">
              <span>Locație</span>
              <select
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              >
                <option value="">Selectează locația</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Step 2: Date + Time */}
        {step === 2 && (
          <div className="modal-body">
            <h2>Alege data și ora</h2>
            <p className="modal-subtitle">Selectează ziua și intervalul orar preferat.</p>

            <label className="modal-field">
              <span>Data</span>
              <input
                type="date"
                value={form.date}
                min={getMinDate()}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </label>

            <div className="time-grid">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`time-slot${form.time === slot ? " selected" : ""}`}
                  onClick={() => updateField("time", slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Personal info + consent */}
        {step === 3 && (
          <div className="modal-body">
            <h2>Datele tale</h2>
            <p className="modal-subtitle">Completează informațiile pentru programare.</p>

            <div className="modal-field-row">
              <label className="modal-field">
                <span>Prenume</span>
                <input
                  type="text"
                  placeholder="Ion"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                />
              </label>
              <label className="modal-field">
                <span>Nume</span>
                <input
                  type="text"
                  placeholder="Popescu"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                />
              </label>
            </div>

            <label className="modal-field">
              <span>Telefon</span>
              <input
                type="tel"
                placeholder="07xx xxx xxx"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="email@exemplu.ro"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </label>

            <label className="consent-check">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
              />
              <span>
                Sunt de acord că tariful afișat și achitat reprezintă avansul serviciilor.
                Am citit și accept{" "}
                <a href="/termeni" target="_blank" rel="noreferrer">termenii și condițiile</a>
                {" "}și{" "}
                <a href="/confidentialitate" target="_blank" rel="noreferrer">politica de confidențialitate</a>.
              </span>
            </label>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="modal-body">
            <h2>Confirmare programare</h2>
            <p className="modal-subtitle">Verifică detaliile și confirmă plata avansului.</p>

            <div className="summary-card">
              <div className="summary-row">
                <span>Serviciu</span>
                <strong>{selectedService?.label}</strong>
              </div>
              <div className="summary-row">
                <span>Locație</span>
                <strong>{form.location}</strong>
              </div>
              <div className="summary-row">
                <span>Data</span>
                <strong>{form.date}</strong>
              </div>
              <div className="summary-row">
                <span>Ora</span>
                <strong>{form.time}</strong>
              </div>
              <div className="summary-row">
                <span>Client</span>
                <strong>{form.firstName} {form.lastName}</strong>
              </div>
              <div className="summary-row">
                <span>Telefon</span>
                <strong>{form.phone}</strong>
              </div>
              <div className="summary-row">
                <span>Email</span>
                <strong>{form.email}</strong>
              </div>
              <div className="summary-total">
                <span>Total avans</span>
                <strong>{selectedService?.price} RON</strong>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Success (when PayU is not configured) */}
        {step === 5 && (
          <div className="modal-body modal-success">
            <div className="success-icon">✓</div>
            <h2>Programare înregistrată!</h2>
            <p className="modal-subtitle">
              Programarea ta a fost salvată cu succes. Vei fi contactat pentru confirmare
              la {form.phone || form.email}.
            </p>
            <p className="modal-note">
              Plata avansului va fi disponibilă în curând prin PayU.
              Momentan, echipa te va contacta direct.
            </p>
          </div>
        )}

        {/* Error */}
        {error && <div className="modal-error">{error}</div>}

        {/* Footer actions */}
        <div className="modal-footer">
          <div className="modal-footer-left">
            {step <= 4 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={close}>
                Renunță
              </button>
            )}
            {step > 1 && step <= 4 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleBack}>
                Înapoi
              </button>
            )}
          </div>

          <div className="modal-footer-right">
            {step < 4 && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={!canNext()}
                onClick={handleNext}
              >
                Continuă
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                className="btn btn-primary"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Se procesează..." : `Plătește ${selectedService?.price} RON`}
              </button>
            )}

            {step === 5 && (
              <button type="button" className="btn btn-primary" onClick={close}>
                Închide
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
