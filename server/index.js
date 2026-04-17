import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { insertBooking, getBooking, updateBookingStatus } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Load vehicle data for configurator
const vehiclesData = JSON.parse(
  readFileSync(join(__dirname, "data/vehicles.json"), "utf-8")
);

// Service prices (in RON)
const PRICES = {
  diagnoza: 150,
  stage1: 400,
  dyno: 200,
};

// PayU configuration (placeholder — replace with real credentials)
const PAYU_MERCHANT = process.env.PAYU_MERCHANT || "";
const PAYU_SECRET = process.env.PAYU_SECRET || "";
const BASE_URL = process.env.BASE_URL || "http://localhost:5174";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Create booking
app.post("/api/bookings", (req, res) => {
  try {
    const { service, location, date, time, firstName, lastName, phone, email } = req.body;

    // Validation
    if (!service || !location || !date || !time || !firstName || !lastName || !phone || !email) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii." });
    }

    const amount = PRICES[service];
    if (!amount) {
      return res.status(400).json({ error: "Serviciu invalid." });
    }

    const id = randomUUID();

    insertBooking.run({
      id,
      service,
      location,
      date,
      time,
      firstName,
      lastName,
      phone,
      email,
      amount,
      status: "pending",
    });

    // If PayU credentials are configured, generate payment URL
    if (PAYU_MERCHANT && PAYU_SECRET) {
      const paymentUrl = generatePayUUrl(id, amount, service, firstName, lastName, email);
      return res.json({ id, paymentUrl });
    }

    // PayU not configured — return success without payment redirect
    updateBookingStatus.run("confirmed_no_payment", null, id);
    return res.json({ id, paymentUrl: null });
  } catch (err) {
    console.error("Error creating booking:", err);
    return res.status(500).json({ error: "Eroare internă." });
  }
});

// Get booking status
app.get("/api/bookings/:id", (req, res) => {
  try {
    const booking = getBooking.get(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: "Programare negăsită." });
    }
    return res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    return res.status(500).json({ error: "Eroare internă." });
  }
});

// PayU IPN (Instant Payment Notification) webhook
app.post("/api/payu/ipn", (req, res) => {
  try {
    // TODO: Validate PayU signature with PAYU_SECRET
    const { REFNOEXT, ORDERSTATUS } = req.body;

    if (REFNOEXT && ORDERSTATUS) {
      const newStatus = ORDERSTATUS === "COMPLETE" ? "paid" : "payment_failed";
      updateBookingStatus.run(newStatus, req.body.REFNO || null, REFNOEXT);
    }

    // PayU expects a specific response format
    // TODO: Generate proper HMAC response
    res.send("<EPAYMENT>OK</EPAYMENT>");
  } catch (err) {
    console.error("Error processing IPN:", err);
    res.status(500).send("ERROR");
  }
});

// PayU payment URL generator (placeholder)
function generatePayUUrl(orderId, amount, service, firstName, lastName, email) {
  // TODO: Implement actual PayU hash generation
  // This is a placeholder structure — replace with real PayU LU (Live Update) request
  //
  // Real implementation requires:
  // 1. Build the hash string from merchant + order params
  // 2. Sign with HMAC-MD5 using PAYU_SECRET
  // 3. POST to https://secure.payu.ro/order/lu.php
  //
  // For now, redirect to success page directly
  console.log(`[PayU Placeholder] Would charge ${amount} RON for order ${orderId}`);

  const params = new URLSearchParams({
    MERCHANT: PAYU_MERCHANT,
    ORDER_REF: orderId,
    ORDER_DATE: new Date().toISOString().split("T")[0],
    "ORDER_PNAME[0]": `Avans ${service}`,
    "ORDER_PCODE[0]": service,
    "ORDER_PPRICE[0]": amount.toString(),
    "ORDER_QTY[0]": "1",
    ORDER_SHIPPING: "0",
    PRICES_CURRENCY: "RON",
    BILL_FNAME: firstName,
    BILL_LNAME: lastName,
    BILL_EMAIL: email,
    BACK_REF: `${BASE_URL}/plata/succes`,
  });

  // In production, this would be the actual PayU URL with a valid hash
  return `https://secure.payu.ro/order/lu.php?${params.toString()}`;
}

/* ═══════════════════════════════════════════
   CONFIGURATOR API
   ═══════════════════════════════════════════ */

// GET /api/configurator/brands — list all brands (name, slug, logo, model count)
app.get("/api/configurator/brands", (_req, res) => {
  const brands = vehiclesData.map((b) => ({
    name: b.name,
    slug: b.slug,
    logo: b.logo,
    modelCount: b.models.length,
  }));
  res.json(brands);
});

// GET /api/configurator/brands/:brandSlug/models — models for a brand
app.get("/api/configurator/brands/:brandSlug/models", (req, res) => {
  const brand = vehiclesData.find((b) => b.slug === req.params.brandSlug);
  if (!brand) return res.status(404).json({ error: "Marca nu a fost gasita." });

  const models = brand.models.map((m) => ({
    name: m.name,
    slug: m.slug,
    years: m.years,
    image: m.image,
    engineCount: m.engines.length,
  }));
  res.json({ brand: brand.name, brandSlug: brand.slug, models });
});

// GET /api/configurator/brands/:brandSlug/models/:modelSlug/engines — engines for a model
app.get("/api/configurator/brands/:brandSlug/models/:modelSlug/engines", (req, res) => {
  const brand = vehiclesData.find((b) => b.slug === req.params.brandSlug);
  if (!brand) return res.status(404).json({ error: "Marca nu a fost gasita." });

  const model = brand.models.find((m) => m.slug === req.params.modelSlug);
  if (!model) return res.status(404).json({ error: "Modelul nu a fost gasit." });

  const engines = model.engines.map((e) => ({
    name: e.name,
    slug: e.slug,
    fuel: e.fuel,
    hp: e.hp,
    nm: e.nm,
    ecu: e.ecu,
    stage1: e.stage1,
    price: e.price,
  }));

  res.json({
    brand: brand.name,
    brandSlug: brand.slug,
    model: model.name,
    modelSlug: model.slug,
    years: model.years,
    image: model.image,
    engines,
  });
});

// GET /api/configurator/vehicle/:brandSlug/:modelSlug/:engineSlug — full vehicle detail
app.get("/api/configurator/vehicle/:brandSlug/:modelSlug/:engineSlug", (req, res) => {
  const brand = vehiclesData.find((b) => b.slug === req.params.brandSlug);
  if (!brand) return res.status(404).json({ error: "Marca nu a fost gasita." });

  const model = brand.models.find((m) => m.slug === req.params.modelSlug);
  if (!model) return res.status(404).json({ error: "Modelul nu a fost gasit." });

  const engine = model.engines.find((e) => e.slug === req.params.engineSlug);
  if (!engine) return res.status(404).json({ error: "Motorizarea nu a fost gasita." });

  res.json({
    brand: { name: brand.name, slug: brand.slug, logo: brand.logo },
    model: { name: model.name, slug: model.slug, years: model.years, image: model.image },
    engine,
  });
});

// In production, serve static files
const distPath = join(__dirname, "../dist");
app.use(express.static(distPath));

// SPA fallback
app.get("/{*path}", (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`CLT API server running on http://localhost:${PORT}`);
});
