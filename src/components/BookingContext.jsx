import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

const SERVICES = [
  { id: "diagnoza", label: "Avans Diagnoză", price: 150 },
  { id: "stage1", label: "Avans Stage 1", price: 400 },
  { id: "dyno", label: "Avans Dyno", price: 200 },
];

const LOCATIONS = [
  "Bacău",
  "Bârlad",
  "Iași",
  "Neamț",
  "Onești",
  "Suceava",
  "Vaslui",
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const INITIAL_FORM = {
  service: "",
  location: "",
  date: "",
  time: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  consent: false,
};

export function BookingProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);

  const open = (preselectedService) => {
    if (preselectedService) {
      setForm((prev) => ({ ...prev, service: preselectedService }));
    }
    setStep(1);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setIsOpen(false);
    setForm(INITIAL_FORM);
    setStep(1);
    document.body.style.overflow = "";
  };

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const selectedService = SERVICES.find((s) => s.id === form.service);

  return (
    <BookingContext.Provider
      value={{
        isOpen,
        open,
        close,
        step,
        setStep,
        form,
        updateField,
        selectedService,
        SERVICES,
        LOCATIONS,
        TIME_SLOTS,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
