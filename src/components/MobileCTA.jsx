import { useBooking } from "./BookingContext";

const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=Strada+Stupinilor+33+Tomesti+Iasi";

export default function MobileCTA() {
  const { open } = useBooking();

  return (
    <div className="mobile-cta-bar">
      <a href="tel:+40754301560">Sună</a>
      <button type="button" onClick={() => open()}>
        Programare
      </button>
      <a href={MAPS_HREF} target="_blank" rel="noreferrer">
        Traseu
      </a>
    </div>
  );
}
