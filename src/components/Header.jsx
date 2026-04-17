import { Link, useLocation } from "react-router-dom";
import { useBooking } from "./BookingContext";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { to: "/", label: "Acasă" },
  { to: "/tuning", label: "Tuning" },
  { to: "/diagnoza", label: "Diagnoză" },
  { to: "/dpf", label: "DPF / FAP" },
  { to: "/egr", label: "EGR" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { open } = useBooking();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <Link className="brand" to="/">
        <img
          className="brand-logo"
          src="https://www.cleanlooktuning.ro/wp-content/uploads/2019/03/logo.png"
          alt="Clean Look Tuning"
        />
        <span className="brand-copy">
          <strong>Clean Look Tuning</strong>
          <span>Iași &bull; Tomești</span>
        </span>
      </Link>

      <nav className={`main-nav${menuOpen ? " is-open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => open()}
        >
          Programare
        </button>

        <button
          type="button"
          className={`burger${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meniu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
