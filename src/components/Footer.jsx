import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <img
              className="footer-logo"
              src="https://www.cleanlooktuning.ro/wp-content/uploads/2019/03/logo.png"
              alt="Clean Look Tuning"
            />
            <strong>Clean Look Tuning</strong>
          </div>
          <p>Strada Stupinilor 33, Tomești, Iași</p>
          <p>Program: 09:00 &ndash; 19:00</p>
        </div>

        <div className="footer-links">
          <span className="footer-heading">Servicii</span>
          <Link to="/tuning">Chip Tuning</Link>
          <Link to="/diagnoza">Diagnoză</Link>
          <Link to="/dpf">DPF / FAP</Link>
          <Link to="/egr">Probleme EGR</Link>
        </div>

        <div className="footer-links">
          <span className="footer-heading">Legal</span>
          <Link to="/termeni">Termeni și condiții</Link>
          <Link to="/confidentialitate">Politica de confidențialitate</Link>
          <Link to="/contract">Contract prestări servicii</Link>
        </div>

        <div className="footer-links">
          <span className="footer-heading">Contact</span>
          <a href="tel:+40754301560">0754 301 560</a>
          <a href="mailto:contact@cleanlooktuning.ro">contact@cleanlooktuning.ro</a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Strada+Stupinilor+33+Tomesti+Iasi"
            target="_blank"
            rel="noreferrer"
          >
            Deschide pe hartă
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Clean Look Tuning. Toate drepturile rezervate.</p>
      </div>
    </footer>
  );
}
