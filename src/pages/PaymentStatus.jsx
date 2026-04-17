import { useParams, Link } from "react-router-dom";

export default function PaymentStatus() {
  const { status } = useParams();
  const success = status === "succes";

  return (
    <section className="section">
      <div className="payment-status-card card" data-reveal>
        <div className={`status-icon ${success ? "success" : "error"}`}>
          {success ? "✓" : "✕"}
        </div>
        <h1>{success ? "Plata a fost realizată cu succes!" : "Plata nu a fost finalizată"}</h1>
        <p>
          {success
            ? "Programarea ta a fost confirmată. Vei primi un email de confirmare cu detaliile complete. Ne vedem la atelier!"
            : "Plata nu a fost procesată. Poți încerca din nou sau ne poți contacta direct la 0754 301 560."}
        </p>
        <div className="payment-status-actions">
          <Link to="/" className="btn btn-primary">
            Înapoi acasă
          </Link>
          {!success && (
            <a href="tel:+40754301560" className="btn btn-secondary">
              Sună-ne
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
