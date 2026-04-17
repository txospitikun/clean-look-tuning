import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BookingProvider } from "./components/BookingContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileCTA from "./components/MobileCTA";
import BookingModal from "./components/BookingModal";
import Home from "./pages/Home";
import Tuning from "./pages/Tuning";
import Diagnoza from "./pages/Diagnoza";
import DPF from "./pages/DPF";
import EGR from "./pages/EGR";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contract from "./pages/Contract";
import PaymentStatus from "./pages/PaymentStatus";
import Configurator from "./pages/Configurator";
import VehicleDetail from "./pages/VehicleDetail";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RevealObserver() {
  const { pathname } = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    function observeNew() {
      const nodes = document.querySelectorAll("[data-reveal]:not(.is-visible)");
      nodes.forEach((n) => observer.observe(n));
    }

    // Initial pass
    const timer = setTimeout(observeNew, 60);

    // Watch for dynamically added data-reveal nodes
    const mutation = new MutationObserver(observeNew);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mutation.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}

/* Mouse-tracking glow on cards */
function CardGlow() {
  useEffect(() => {
    const handler = (e) => {
      const cards = document.querySelectorAll(
        ".service-card, .trust-card, .benefit-card, .stage-card, .cfg-engine-card, .cfg-brand-card"
      );
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      });
    };
    document.addEventListener("mousemove", handler, { passive: true });
    return () => document.removeEventListener("mousemove", handler);
  }, []);
  return null;
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <RevealObserver />
      <CardGlow />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tuning" element={<Tuning />} />
          <Route path="/diagnoza" element={<Diagnoza />} />
          <Route path="/dpf" element={<DPF />} />
          <Route path="/egr" element={<EGR />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/configurator/:brandSlug/:modelSlug/:engineSlug" element={<VehicleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/termeni" element={<Terms />} />
          <Route path="/confidentialitate" element={<Privacy />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/plata/:status" element={<PaymentStatus />} />
        </Routes>
      </main>
      <Footer />
      <MobileCTA />
      <BookingModal />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <div className="app-shell">
          <Layout />
        </div>
      </BookingProvider>
    </BrowserRouter>
  );
}
