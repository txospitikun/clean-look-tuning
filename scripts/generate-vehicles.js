/**
 * Vehicle Data Generator for Clean Look Tuning Configurator
 *
 * Generates server/data/vehicles.json with ~35 brands, hundreds of models,
 * and ~800-1200 engine entries. Uses shared engine families (e.g. VAG 2.0 TDI
 * appears in VW, Audi, Skoda, Seat, Cupra).
 *
 * Run:  node scripts/generate-vehicles.js
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../server/data/vehicles.json");

/* ─── helpers ─── */
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[áàâä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[íìîï]/g, "i")
    .replace(/[óòôö]/g, "o")
    .replace(/[úùûü]/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function makeEngine(name, fuel, hp, nm, ecu, s1hp, s1nm, price = 249) {
  return {
    name,
    slug: slug(name),
    fuel,
    hp,
    nm,
    ecu,
    stage1: { hp: s1hp, nm: s1nm },
    price,
  };
}

/* ─────────────────────────────────────────────
   ENGINE FAMILIES (shared across brands)
   ───────────────────────────────────────────── */

const VAG_ENGINES = {
  diesel: [
    makeEngine("1.6 TDI 90 CP", "Diesel", 90, 230, "Bosch EDC17C46", 130, 300),
    makeEngine("1.6 TDI 105 CP", "Diesel", 105, 250, "Bosch EDC17C46", 140, 320),
    makeEngine("1.6 TDI 115 CP", "Diesel", 115, 250, "Delphi DCM6.2", 150, 330),
    makeEngine("2.0 TDI 110 CP", "Diesel", 110, 280, "Bosch EDC17C46", 155, 350),
    makeEngine("2.0 TDI 140 CP", "Diesel", 140, 320, "Bosch EDC17C46", 185, 400),
    makeEngine("2.0 TDI 143 CP", "Diesel", 143, 320, "Bosch EDC17CP14", 185, 400),
    makeEngine("2.0 TDI 150 CP", "Diesel", 150, 340, "Bosch EDC17C74", 195, 420),
    makeEngine("2.0 TDI 170 CP", "Diesel", 170, 350, "Bosch EDC17CP20", 210, 430),
    makeEngine("2.0 TDI 184 CP", "Diesel", 184, 380, "Bosch EDC17C74", 225, 460),
    makeEngine("2.0 TDI 190 CP", "Diesel", 190, 400, "Bosch EDC17C74", 235, 470),
    makeEngine("2.0 TDI 200 CP", "Diesel", 200, 400, "Bosch MD1CS004", 245, 480),
    makeEngine("1.9 TDI 90 CP", "Diesel", 90, 210, "Bosch EDC15P", 120, 280),
    makeEngine("1.9 TDI 100 CP", "Diesel", 100, 240, "Bosch EDC15P", 135, 310),
    makeEngine("1.9 TDI 105 CP", "Diesel", 105, 250, "Bosch EDC16U34", 140, 320),
    makeEngine("1.9 TDI 130 CP", "Diesel", 130, 310, "Bosch EDC15P+", 165, 380),
    makeEngine("3.0 TDI 204 CP", "Diesel", 204, 450, "Bosch EDC17CP44", 265, 550),
    makeEngine("3.0 TDI 245 CP", "Diesel", 245, 500, "Bosch EDC17CP44", 300, 600),
  ],
  petrol: [
    makeEngine("1.0 TSI 95 CP", "Benzina", 95, 160, "Bosch MED17.5.21", 120, 200),
    makeEngine("1.0 TSI 110 CP", "Benzina", 110, 200, "Bosch MED17.5.21", 135, 240),
    makeEngine("1.2 TSI 86 CP", "Benzina", 86, 160, "Bosch MED17.5.20", 110, 200),
    makeEngine("1.2 TSI 105 CP", "Benzina", 105, 175, "Bosch MED17.5.20", 130, 220),
    makeEngine("1.4 TSI 122 CP", "Benzina", 122, 200, "Bosch MED17.5.20", 155, 260),
    makeEngine("1.4 TSI 125 CP", "Benzina", 125, 200, "Bosch MED17.5.25", 155, 260),
    makeEngine("1.4 TSI 140 CP", "Benzina", 140, 250, "Bosch MED17.5.20", 175, 305),
    makeEngine("1.4 TSI 150 CP", "Benzina", 150, 250, "Bosch MED17.5.25", 180, 310),
    makeEngine("1.5 TSI 150 CP", "Benzina", 150, 250, "Bosch MG1CS011", 180, 310),
    makeEngine("1.8 TSI 160 CP", "Benzina", 160, 250, "Bosch MED17.5", 200, 320),
    makeEngine("1.8 TSI 180 CP", "Benzina", 180, 250, "Bosch MED17.5.2", 220, 330),
    makeEngine("2.0 TSI 190 CP", "Benzina", 190, 320, "Bosch MG1CS111", 240, 400),
    makeEngine("2.0 TSI 200 CP", "Benzina", 200, 280, "Bosch MED17.5", 255, 370),
    makeEngine("2.0 TSI 220 CP", "Benzina", 220, 350, "Bosch MED17.1.1", 275, 430),
    makeEngine("2.0 TSI 245 CP", "Benzina", 245, 370, "Bosch MG1CS111", 300, 450),
    makeEngine("2.0 TFSI 310 CP", "Benzina", 310, 400, "Siemens Simos 18.1", 370, 480),
  ],
};

const BMW_ENGINES = {
  diesel: [
    makeEngine("1.5d 116 CP (B37)", "Diesel", 116, 270, "Bosch EDC17C50", 150, 340),
    makeEngine("1.8d 150 CP (B47)", "Diesel", 150, 350, "Bosch EDC17C50", 195, 430),
    makeEngine("2.0d 150 CP (N47)", "Diesel", 150, 330, "Bosch EDC17C41", 195, 410),
    makeEngine("2.0d 163 CP (N47)", "Diesel", 163, 350, "Bosch EDC17C41", 205, 420),
    makeEngine("2.0d 177 CP (N47)", "Diesel", 177, 350, "Bosch EDC17C41", 215, 430),
    makeEngine("2.0d 184 CP (N47)", "Diesel", 184, 380, "Bosch EDC17C41", 225, 450),
    makeEngine("2.0d 190 CP (B47)", "Diesel", 190, 400, "Bosch EDC17C76", 240, 480),
    makeEngine("2.0d 231 CP (B47)", "Diesel", 231, 500, "Bosch EDC17C76", 280, 570),
    makeEngine("3.0d 190 CP (N57)", "Diesel", 190, 400, "Bosch EDC17CP45", 240, 490),
    makeEngine("3.0d 258 CP (N57)", "Diesel", 258, 560, "Bosch EDC17CP45", 310, 640),
    makeEngine("3.0d 265 CP (B57)", "Diesel", 265, 620, "Bosch EDC17C76", 320, 700),
    makeEngine("3.0d 313 CP (N57S)", "Diesel", 313, 630, "Bosch EDC17CP45", 370, 720),
  ],
  petrol: [
    makeEngine("1.5i 136 CP (B38)", "Benzina", 136, 220, "Bosch MEVD17.2.3", 170, 280),
    makeEngine("2.0i 184 CP (N20)", "Benzina", 184, 270, "Bosch MEVD17.2.4", 230, 350),
    makeEngine("2.0i 192 CP (B48)", "Benzina", 192, 280, "Bosch MG1CS003", 240, 360),
    makeEngine("2.0i 252 CP (B48)", "Benzina", 252, 350, "Bosch MG1CS003", 300, 420),
    makeEngine("3.0i 306 CP (N55)", "Benzina", 306, 400, "Siemens MSD81", 370, 500),
    makeEngine("3.0i 326 CP (B58)", "Benzina", 326, 450, "Bosch MG1CS003", 400, 550),
    makeEngine("3.0i 340 CP (B58)", "Benzina", 340, 450, "Bosch MG1CS003", 410, 560),
    makeEngine("3.0i 374 CP (B58)", "Benzina", 374, 500, "Bosch MG1CS003", 430, 590),
  ],
};

const MERCEDES_ENGINES = {
  diesel: [
    makeEngine("1.5 dCi 116 CP (OM608)", "Diesel", 116, 260, "Bosch EDC17C69", 150, 330),
    makeEngine("2.0d 150 CP (OM654)", "Diesel", 150, 360, "Delphi CRD3.60", 190, 440),
    makeEngine("2.1 CDI 136 CP (OM651)", "Diesel", 136, 300, "Delphi CRD3.10", 180, 390),
    makeEngine("2.1 CDI 163 CP (OM651)", "Diesel", 163, 400, "Delphi CRD3.10", 205, 470),
    makeEngine("2.1 CDI 170 CP (OM651)", "Diesel", 170, 400, "Delphi CRD3.40", 210, 470),
    makeEngine("2.1 CDI 204 CP (OM651)", "Diesel", 204, 500, "Delphi CRD3.40", 245, 560),
    makeEngine("2.0d 194 CP (OM654)", "Diesel", 194, 400, "Bosch EDC17CP57", 240, 490),
    makeEngine("2.0d 245 CP (OM654)", "Diesel", 245, 500, "Bosch MD1CP001", 290, 580),
    makeEngine("3.0 CDI 231 CP (OM642)", "Diesel", 231, 540, "Bosch EDC17CP46", 290, 630),
    makeEngine("3.0 CDI 258 CP (OM642)", "Diesel", 258, 620, "Bosch EDC17CP46", 310, 700),
  ],
  petrol: [
    makeEngine("1.6 Turbo 122 CP (M270)", "Benzina", 122, 200, "Bosch MED17.7.2", 155, 255),
    makeEngine("1.6 Turbo 156 CP (M270)", "Benzina", 156, 250, "Bosch MED17.7.2", 195, 310),
    makeEngine("2.0 Turbo 184 CP (M274)", "Benzina", 184, 300, "Bosch MED17.7.2", 230, 380),
    makeEngine("2.0 Turbo 211 CP (M274)", "Benzina", 211, 350, "Bosch MED17.7.2", 260, 420),
    makeEngine("2.0 Turbo 245 CP (M260)", "Benzina", 245, 370, "Bosch MG1CP002", 290, 440),
    makeEngine("3.0 V6 Turbo 367 CP (M276)", "Benzina", 367, 500, "Bosch MED17.7.3", 430, 600),
    makeEngine("3.0 I6 Turbo 367 CP (M256)", "Benzina", 367, 500, "Bosch MG1CP002", 430, 600),
  ],
};

const FORD_ENGINES = {
  diesel: [
    makeEngine("1.5 TDCi 75 CP", "Diesel", 75, 185, "Delphi DCM3.5", 105, 240),
    makeEngine("1.5 TDCi 95 CP", "Diesel", 95, 215, "Delphi DCM3.5", 130, 280),
    makeEngine("1.5 TDCi 120 CP", "Diesel", 120, 270, "Bosch EDC17C70", 160, 340),
    makeEngine("1.5 EcoBlue 120 CP", "Diesel", 120, 300, "Bosch MD1CS005", 160, 370),
    makeEngine("1.6 TDCi 95 CP", "Diesel", 95, 215, "Delphi DCM3.5", 130, 280),
    makeEngine("1.6 TDCi 115 CP", "Diesel", 115, 270, "Delphi DCM3.5", 155, 340),
    makeEngine("2.0 TDCi 115 CP", "Diesel", 115, 285, "Delphi DCM3.5", 155, 355),
    makeEngine("2.0 TDCi 130 CP", "Diesel", 130, 340, "Delphi DCM3.5", 170, 400),
    makeEngine("2.0 TDCi 140 CP", "Diesel", 140, 320, "Delphi DCM3.5", 180, 400),
    makeEngine("2.0 TDCi 150 CP", "Diesel", 150, 370, "Bosch EDC17C70", 195, 440),
    makeEngine("2.0 EcoBlue 150 CP", "Diesel", 150, 370, "Bosch MD1CS005", 195, 440),
    makeEngine("2.0 TDCi 163 CP", "Diesel", 163, 340, "Delphi DCM3.5", 200, 420),
    makeEngine("2.0 TDCi 180 CP", "Diesel", 180, 400, "Bosch EDC17C70", 225, 480),
    makeEngine("2.0 EcoBlue 190 CP", "Diesel", 190, 400, "Bosch MD1CS005", 235, 480),
  ],
  petrol: [
    makeEngine("1.0 EcoBoost 100 CP", "Benzina", 100, 170, "Bosch MED17.0.1", 135, 220),
    makeEngine("1.0 EcoBoost 125 CP", "Benzina", 125, 200, "Bosch MED17.0.1", 155, 250),
    makeEngine("1.0 EcoBoost 140 CP", "Benzina", 140, 200, "Bosch MED17.0.1", 170, 260),
    makeEngine("1.5 EcoBoost 150 CP", "Benzina", 150, 240, "Bosch MED17.0.1", 190, 300),
    makeEngine("1.5 EcoBoost 182 CP", "Benzina", 182, 240, "Bosch MED17.0.1", 215, 310),
    makeEngine("2.0 EcoBoost 240 CP", "Benzina", 240, 340, "Bosch MED17.2", 285, 420),
    makeEngine("2.3 EcoBoost 280 CP", "Benzina", 280, 420, "Bosch MED17.2", 330, 500),
  ],
};

const OPEL_ENGINES = {
  diesel: [
    makeEngine("1.3 CDTi 75 CP", "Diesel", 75, 190, "Marelli MJD6F3", 100, 240),
    makeEngine("1.3 CDTi 95 CP", "Diesel", 95, 190, "Marelli MJD6F3", 120, 250),
    makeEngine("1.5 Diesel 105 CP", "Diesel", 105, 260, "Bosch MD1CS003", 140, 320),
    makeEngine("1.5 Diesel 122 CP", "Diesel", 122, 300, "Bosch MD1CS003", 155, 360),
    makeEngine("1.6 CDTi 110 CP", "Diesel", 110, 300, "Delphi DCM6.2A", 145, 360),
    makeEngine("1.6 CDTi 136 CP", "Diesel", 136, 320, "Delphi DCM6.2A", 170, 390),
    makeEngine("1.7 CDTi 110 CP", "Diesel", 110, 260, "Denso SH7058", 145, 320),
    makeEngine("1.7 CDTi 125 CP", "Diesel", 125, 300, "Denso SH7058", 160, 360),
    makeEngine("1.7 CDTi 130 CP", "Diesel", 130, 300, "Denso SH7058", 165, 365),
    makeEngine("2.0 CDTi 130 CP", "Diesel", 130, 300, "Bosch EDC17C18", 170, 380),
    makeEngine("2.0 CDTi 160 CP", "Diesel", 160, 350, "Bosch EDC17C18", 200, 430),
    makeEngine("2.0 CDTi 170 CP", "Diesel", 170, 400, "Bosch EDC17C59", 210, 465),
  ],
  petrol: [
    makeEngine("1.0 Turbo 105 CP", "Benzina", 105, 170, "Delco E80", 130, 215),
    makeEngine("1.2 Turbo 110 CP", "Benzina", 110, 205, "Delco E80", 140, 250),
    makeEngine("1.2 Turbo 130 CP", "Benzina", 130, 230, "Delco E80", 160, 275),
    makeEngine("1.4 Turbo 120 CP", "Benzina", 120, 200, "Delco E78", 150, 255),
    makeEngine("1.4 Turbo 140 CP", "Benzina", 140, 200, "Delco E78", 170, 260),
    makeEngine("1.4 Turbo 150 CP", "Benzina", 150, 245, "Delco E80", 180, 300),
    makeEngine("1.6 Turbo 170 CP", "Benzina", 170, 280, "Delco E80", 210, 340),
    makeEngine("1.6 Turbo 200 CP", "Benzina", 200, 300, "Delco E80", 240, 370),
  ],
};

const RENAULT_ENGINES = {
  diesel: [
    makeEngine("1.5 dCi 75 CP", "Diesel", 75, 180, "Delphi DCM1.2", 105, 235),
    makeEngine("1.5 dCi 85 CP", "Diesel", 85, 200, "Delphi DCM1.2", 115, 255),
    makeEngine("1.5 dCi 90 CP", "Diesel", 90, 220, "Siemens SID305", 120, 275),
    makeEngine("1.5 dCi 110 CP", "Diesel", 110, 260, "Siemens SID307", 140, 320),
    makeEngine("1.5 Blue dCi 95 CP", "Diesel", 95, 240, "Bosch MD1CS006", 125, 300),
    makeEngine("1.5 Blue dCi 115 CP", "Diesel", 115, 270, "Bosch MD1CS006", 150, 330),
    makeEngine("1.6 dCi 130 CP", "Diesel", 130, 320, "Bosch EDC17C42", 165, 390),
    makeEngine("1.6 dCi 160 CP", "Diesel", 160, 380, "Bosch EDC17C42", 200, 445),
    makeEngine("2.0 dCi 150 CP", "Diesel", 150, 340, "Bosch EDC16CP33", 190, 415),
    makeEngine("2.0 dCi 175 CP", "Diesel", 175, 360, "Bosch EDC16CP33", 210, 435),
  ],
  petrol: [
    makeEngine("0.9 TCe 90 CP", "Benzina", 90, 135, "Siemens EMS3110", 110, 170),
    makeEngine("1.0 TCe 100 CP", "Benzina", 100, 160, "Siemens EMS3120", 125, 200),
    makeEngine("1.2 TCe 100 CP", "Benzina", 100, 175, "Siemens EMS3110", 125, 215),
    makeEngine("1.2 TCe 115 CP", "Benzina", 115, 190, "Siemens EMS3125", 140, 240),
    makeEngine("1.2 TCe 130 CP", "Benzina", 130, 205, "Siemens EMS3125", 155, 255),
    makeEngine("1.3 TCe 130 CP", "Benzina", 130, 240, "Bosch MED17.3.4", 160, 295),
    makeEngine("1.3 TCe 140 CP", "Benzina", 140, 240, "Bosch MED17.3.4", 170, 300),
    makeEngine("1.3 TCe 160 CP", "Benzina", 160, 270, "Bosch MED17.3.4", 195, 330),
    makeEngine("1.6 Turbo 205 CP", "Benzina", 205, 280, "Siemens EMS3130", 250, 350),
    makeEngine("1.8 Turbo 280 CP", "Benzina", 280, 390, "Siemens EMS3145", 330, 465),
  ],
};

const PSA_ENGINES = {
  diesel: [
    makeEngine("1.5 BlueHDi 100 CP", "Diesel", 100, 250, "Bosch EDC17C60", 135, 310),
    makeEngine("1.5 BlueHDi 130 CP", "Diesel", 130, 300, "Bosch EDC17C60", 165, 370),
    makeEngine("1.6 BlueHDi 75 CP", "Diesel", 75, 230, "Bosch EDC17C10", 105, 280),
    makeEngine("1.6 BlueHDi 100 CP", "Diesel", 100, 254, "Bosch EDC17C10", 135, 310),
    makeEngine("1.6 BlueHDi 120 CP", "Diesel", 120, 300, "Bosch EDC17C60", 155, 365),
    makeEngine("1.6 HDi 92 CP", "Diesel", 92, 230, "Bosch EDC17C10", 120, 280),
    makeEngine("1.6 HDi 110 CP", "Diesel", 110, 240, "Bosch EDC16C34", 140, 305),
    makeEngine("2.0 BlueHDi 150 CP", "Diesel", 150, 370, "Delphi DCM6.2A", 195, 440),
    makeEngine("2.0 BlueHDi 163 CP", "Diesel", 163, 340, "Delphi DCM3.5", 200, 420),
    makeEngine("2.0 BlueHDi 177 CP", "Diesel", 177, 400, "Delphi DCM6.2A", 215, 470),
    makeEngine("2.0 HDi 136 CP", "Diesel", 136, 320, "Bosch EDC16C34", 175, 390),
  ],
  petrol: [
    makeEngine("1.0 VTi 68 CP", "Benzina", 68, 95, "Valeo VD46.1", 68, 95, 0),
    makeEngine("1.2 PureTech 82 CP", "Benzina", 82, 118, "Valeo VD56.1", 82, 118, 0),
    makeEngine("1.2 PureTech 110 CP", "Benzina", 110, 205, "Valeo VD56.1", 140, 255),
    makeEngine("1.2 PureTech 130 CP", "Benzina", 130, 230, "Valeo VD56.1", 160, 280),
    makeEngine("1.6 THP 156 CP", "Benzina", 156, 240, "Bosch MEV17.4", 195, 300),
    makeEngine("1.6 THP 165 CP", "Benzina", 165, 240, "Bosch MEV17.4.2", 200, 305),
    makeEngine("1.6 THP 200 CP", "Benzina", 200, 275, "Bosch MED17.4.2", 240, 340),
    makeEngine("1.6 THP 270 CP", "Benzina", 270, 330, "Bosch MED17.4.4", 310, 400),
  ],
};

const HYUNDAI_KIA_ENGINES = {
  diesel: [
    makeEngine("1.1 CRDi 75 CP", "Diesel", 75, 180, "Bosch EDC17C08", 100, 230),
    makeEngine("1.4 CRDi 90 CP", "Diesel", 90, 220, "Bosch EDC17C08", 120, 275),
    makeEngine("1.5 CRDi 115 CP", "Diesel", 115, 280, "Bosch EDC17C57", 150, 340),
    makeEngine("1.6 CRDi 110 CP", "Diesel", 110, 260, "Bosch EDC17C57", 145, 325),
    makeEngine("1.6 CRDi 115 CP", "Diesel", 115, 280, "Bosch EDC17C57", 150, 340),
    makeEngine("1.6 CRDi 128 CP", "Diesel", 128, 260, "Bosch EDC17C57", 160, 330),
    makeEngine("1.6 CRDi 136 CP", "Diesel", 136, 320, "Bosch EDC17C57", 170, 380),
    makeEngine("1.7 CRDi 115 CP", "Diesel", 115, 260, "Bosch EDC17C53", 150, 325),
    makeEngine("1.7 CRDi 141 CP", "Diesel", 141, 340, "Bosch EDC17C53", 175, 405),
    makeEngine("2.0 CRDi 136 CP", "Diesel", 136, 305, "Bosch EDC17CP62", 175, 380),
    makeEngine("2.0 CRDi 150 CP", "Diesel", 150, 340, "Bosch EDC17CP62", 190, 410),
    makeEngine("2.0 CRDi 185 CP", "Diesel", 185, 400, "Bosch EDC17CP62", 225, 470),
    makeEngine("2.2 CRDi 200 CP", "Diesel", 200, 440, "Bosch EDC17CP62", 245, 520),
  ],
  petrol: [
    makeEngine("1.0 T-GDi 100 CP", "Benzina", 100, 172, "Kefico CPGDSH1.5", 130, 215),
    makeEngine("1.0 T-GDi 120 CP", "Benzina", 120, 172, "Kefico CPGDSH1.5", 145, 220),
    makeEngine("1.4 T-GDi 140 CP", "Benzina", 140, 242, "Kefico CPGDSH2", 170, 295),
    makeEngine("1.6 T-GDi 177 CP", "Benzina", 177, 265, "Kefico CPGDSH4.1", 215, 330),
    makeEngine("1.6 T-GDi 204 CP", "Benzina", 204, 265, "Kefico CPGDSH4.1", 240, 330),
    makeEngine("2.0 T-GDi 245 CP", "Benzina", 245, 353, "Kefico CPGDSH6", 290, 425),
    makeEngine("2.0 T-GDi 275 CP", "Benzina", 275, 353, "Kefico CPGDSH6", 320, 430),
  ],
};

const FIAT_ENGINES = {
  diesel: [
    makeEngine("1.3 MultiJet 75 CP", "Diesel", 75, 190, "Marelli MJD6F3", 100, 240),
    makeEngine("1.3 MultiJet 95 CP", "Diesel", 95, 200, "Marelli MJD8F2", 120, 260),
    makeEngine("1.6 MultiJet 105 CP", "Diesel", 105, 290, "Bosch EDC16C39", 140, 350),
    makeEngine("1.6 MultiJet 120 CP", "Diesel", 120, 320, "Marelli MJD8F2", 155, 380),
    makeEngine("2.0 MultiJet 140 CP", "Diesel", 140, 350, "Bosch EDC16C39", 180, 420),
    makeEngine("2.0 MultiJet 163 CP", "Diesel", 163, 350, "Marelli MJD8DF", 200, 430),
  ],
  petrol: [
    makeEngine("0.9 TwinAir 85 CP", "Benzina", 85, 145, "Marelli 8F2", 105, 175),
    makeEngine("0.9 TwinAir 105 CP", "Benzina", 105, 145, "Marelli 8F2", 125, 180),
    makeEngine("1.4 MultiAir 140 CP", "Benzina", 140, 230, "Marelli 8GMF", 170, 280),
    makeEngine("1.4 T-Jet 120 CP", "Benzina", 120, 206, "Bosch ME7.9.10", 150, 260),
    makeEngine("1.4 Turbo 170 CP", "Benzina", 170, 250, "Bosch MED17.3.1", 200, 305),
  ],
};

const VOLVO_ENGINES = {
  diesel: [
    makeEngine("2.0 D2 120 CP (D4204T14)", "Diesel", 120, 280, "Denso SH72543", 155, 345),
    makeEngine("2.0 D3 150 CP (D4204T9)", "Diesel", 150, 350, "Denso SH72543", 195, 425),
    makeEngine("2.0 D4 190 CP (D4204T14)", "Diesel", 190, 400, "Denso SH72543", 235, 480),
    makeEngine("2.0 D5 235 CP (D4204T23)", "Diesel", 235, 480, "Denso SH72543", 280, 560),
    makeEngine("2.4 D5 205 CP (D5244T)", "Diesel", 205, 420, "Bosch EDC17CP22", 250, 500),
    makeEngine("2.4 D5 215 CP (D5244T)", "Diesel", 215, 440, "Bosch EDC17CP22", 260, 520),
  ],
  petrol: [
    makeEngine("2.0 T3 152 CP (B4204T37)", "Benzina", 152, 250, "Denso SH72546", 190, 310),
    makeEngine("2.0 T4 190 CP (B4204T30)", "Benzina", 190, 300, "Denso SH72546", 235, 370),
    makeEngine("2.0 T5 245 CP (B4204T23)", "Benzina", 245, 350, "Denso SH72546", 290, 420),
    makeEngine("2.0 T5 254 CP (B4204T26)", "Benzina", 254, 350, "Denso SH72546", 300, 430),
    makeEngine("2.0 T6 310 CP (B4204T35)", "Benzina", 310, 400, "Denso SH72546", 360, 480),
  ],
};

const TOYOTA_ENGINES = {
  diesel: [
    makeEngine("1.4 D-4D 90 CP", "Diesel", 90, 205, "Denso 89661", 120, 265),
    makeEngine("1.6 D-4D 112 CP", "Diesel", 112, 270, "Denso 89661", 145, 330),
    makeEngine("2.0 D-4D 124 CP", "Diesel", 124, 310, "Denso 89661", 160, 380),
    makeEngine("2.0 D-4D 143 CP", "Diesel", 143, 320, "Denso 89661", 180, 395),
    makeEngine("2.2 D-4D 150 CP", "Diesel", 150, 340, "Denso 89661", 190, 410),
    makeEngine("2.2 D-CAT 177 CP", "Diesel", 177, 400, "Denso 89661", 215, 470),
  ],
  petrol: [
    makeEngine("1.2 Turbo 116 CP", "Benzina", 116, 185, "Denso 89661", 140, 225),
    makeEngine("1.6 Valvematic 132 CP", "Benzina", 132, 160, "Denso 89661", 132, 160, 0),
    makeEngine("2.0 Valvematic 152 CP", "Benzina", 152, 190, "Denso 89661", 152, 190, 0),
  ],
};

const NISSAN_ENGINES = {
  diesel: [
    makeEngine("1.5 dCi 86 CP", "Diesel", 86, 200, "Siemens SID301", 115, 260),
    makeEngine("1.5 dCi 90 CP", "Diesel", 90, 220, "Siemens SID305", 120, 275),
    makeEngine("1.5 dCi 110 CP", "Diesel", 110, 260, "Siemens SID307", 140, 320),
    makeEngine("1.6 dCi 130 CP", "Diesel", 130, 320, "Bosch EDC17C42", 165, 390),
    makeEngine("2.0 dCi 150 CP", "Diesel", 150, 320, "Bosch EDC16CP33", 190, 395),
    makeEngine("2.0 dCi 175 CP", "Diesel", 175, 360, "Bosch EDC16CP33", 210, 435),
  ],
  petrol: [
    makeEngine("1.0 DIG-T 117 CP", "Benzina", 117, 180, "Continental EMS3120", 140, 220),
    makeEngine("1.2 DIG-T 115 CP", "Benzina", 115, 190, "Continental EMS3125", 140, 240),
    makeEngine("1.3 DIG-T 140 CP", "Benzina", 140, 240, "Continental EMS3140", 170, 300),
    makeEngine("1.3 DIG-T 160 CP", "Benzina", 160, 270, "Continental EMS3140", 195, 330),
    makeEngine("1.6 DIG-T 190 CP", "Benzina", 190, 240, "Continental EMS3130", 225, 300),
  ],
};

const MAZDA_ENGINES = {
  diesel: [
    makeEngine("1.5 Skyactiv-D 105 CP", "Diesel", 105, 270, "Denso SH7465", 135, 330),
    makeEngine("2.2 Skyactiv-D 150 CP", "Diesel", 150, 380, "Denso SH7465", 190, 450),
    makeEngine("2.2 Skyactiv-D 175 CP", "Diesel", 175, 420, "Denso SH7465", 215, 490),
    makeEngine("2.2 Skyactiv-D 184 CP", "Diesel", 184, 445, "Denso SH7465", 225, 510),
  ],
  petrol: [
    makeEngine("2.0 Skyactiv-G 120 CP", "Benzina", 120, 210, "Denso SH7465", 120, 210, 0),
    makeEngine("2.0 Skyactiv-G 165 CP", "Benzina", 165, 210, "Denso SH7465", 165, 210, 0),
    makeEngine("2.5 Skyactiv-G Turbo 230 CP", "Benzina", 230, 420, "Denso SH7465", 270, 490),
  ],
};

const HONDA_ENGINES = {
  diesel: [
    makeEngine("1.6 i-DTEC 120 CP", "Diesel", 120, 300, "Bosch EDC17C58", 155, 365),
    makeEngine("1.6 i-DTEC 160 CP", "Diesel", 160, 350, "Bosch EDC17C58", 195, 420),
    makeEngine("2.2 i-DTEC 150 CP", "Diesel", 150, 350, "Bosch EDC17CP16", 190, 420),
  ],
  petrol: [
    makeEngine("1.0 VTEC Turbo 129 CP", "Benzina", 129, 200, "Keihin 37820", 155, 245),
    makeEngine("1.5 VTEC Turbo 182 CP", "Benzina", 182, 240, "Keihin 37820", 220, 300),
    makeEngine("2.0 VTEC Turbo 310 CP", "Benzina", 310, 400, "Keihin 37820", 355, 465),
    makeEngine("2.0 VTEC Turbo 320 CP", "Benzina", 320, 400, "Keihin 37820", 365, 470),
  ],
};

const MITSUBISHI_ENGINES = {
  diesel: [
    makeEngine("1.6 DI-D 115 CP", "Diesel", 115, 270, "Siemens SID307", 150, 330),
    makeEngine("2.2 DI-D 150 CP", "Diesel", 150, 380, "Denso SH7058", 190, 450),
    makeEngine("2.3 DI-D 190 CP", "Diesel", 190, 430, "Denso SH7058", 230, 510),
  ],
  petrol: [
    makeEngine("1.5 Turbo MIVEC 163 CP", "Benzina", 163, 250, "Continental EMS3130", 200, 310),
  ],
};

const SUZUKI_ENGINES = {
  diesel: [
    makeEngine("1.3 DDiS 75 CP", "Diesel", 75, 190, "Marelli MJD6F3", 100, 240),
    makeEngine("1.6 DDiS 120 CP", "Diesel", 120, 320, "Delphi DCM3.7", 155, 385),
  ],
  petrol: [
    makeEngine("1.0 BoosterJet 112 CP", "Benzina", 112, 170, "Denso 33920", 135, 210),
    makeEngine("1.4 BoosterJet 140 CP", "Benzina", 140, 220, "Denso 33920", 170, 270),
  ],
};

const PORSCHE_ENGINES = {
  diesel: [
    makeEngine("3.0 V6 Diesel 211 CP", "Diesel", 211, 450, "Bosch EDC17CP44", 270, 560),
    makeEngine("3.0 V6 Diesel 262 CP", "Diesel", 262, 580, "Bosch EDC17CP44", 310, 660),
    makeEngine("4.2 V8 Diesel 385 CP", "Diesel", 385, 850, "Bosch EDC17CP44", 440, 960, 349),
  ],
  petrol: [
    makeEngine("2.0 Turbo 252 CP (718)", "Benzina", 252, 310, "Bosch MG1CS111", 300, 390),
    makeEngine("2.5 Turbo 350 CP (718S)", "Benzina", 350, 420, "Bosch MG1CS111", 400, 490, 349),
    makeEngine("3.0 Turbo 370 CP (991.2)", "Benzina", 370, 450, "Bosch MG1CS111", 430, 530, 349),
    makeEngine("3.0 Turbo 450 CP (991.2S)", "Benzina", 450, 530, "Bosch MG1CS111", 510, 610, 449),
    makeEngine("2.9 V6 Turbo 380 CP (Macan S)", "Benzina", 380, 520, "Bosch MG1CS111", 440, 600, 349),
    makeEngine("3.0 V6 Turbo 340 CP (Cayenne)", "Benzina", 340, 450, "Bosch MG1CS111", 400, 530, 349),
    makeEngine("2.9 V6 Turbo 440 CP (Cayenne S)", "Benzina", 440, 550, "Bosch MG1CS111", 510, 640, 449),
  ],
};

const MINI_ENGINES = {
  diesel: [
    makeEngine("1.5 Cooper D 116 CP (B37)", "Diesel", 116, 270, "Bosch EDC17C50", 150, 340),
    makeEngine("2.0 Cooper SD 170 CP (B47)", "Diesel", 170, 360, "Bosch EDC17C50", 210, 440),
  ],
  petrol: [
    makeEngine("1.5 Cooper 136 CP (B38)", "Benzina", 136, 220, "Bosch MEVD17.2.3", 170, 280),
    makeEngine("2.0 Cooper S 192 CP (B48)", "Benzina", 192, 280, "Bosch MG1CS003", 240, 360),
    makeEngine("2.0 JCW 231 CP (B48)", "Benzina", 231, 320, "Bosch MG1CS003", 275, 400),
    makeEngine("2.0 JCW 306 CP (B48TU)", "Benzina", 306, 450, "Bosch MG1CS003", 350, 510),
  ],
};

const JAGUAR_ENGINES = {
  diesel: [
    makeEngine("2.0d 150 CP (Ingenium)", "Diesel", 150, 380, "Bosch EDC17CP55", 195, 450),
    makeEngine("2.0d 180 CP (Ingenium)", "Diesel", 180, 430, "Bosch EDC17CP55", 225, 510),
    makeEngine("2.0d 240 CP (Ingenium)", "Diesel", 240, 500, "Bosch EDC17CP55", 285, 580),
    makeEngine("3.0 V6 Diesel 300 CP", "Diesel", 300, 700, "Bosch EDC17CP55", 350, 790, 349),
  ],
  petrol: [
    makeEngine("2.0 Turbo 200 CP (Ingenium)", "Benzina", 200, 320, "Bosch MG1CS017", 245, 395),
    makeEngine("2.0 Turbo 250 CP (Ingenium)", "Benzina", 250, 365, "Bosch MG1CS017", 295, 435),
    makeEngine("2.0 Turbo 300 CP (Ingenium)", "Benzina", 300, 400, "Bosch MG1CS017", 345, 470),
    makeEngine("3.0 V6 S/C 340 CP", "Benzina", 340, 450, "Bosch MED17.8.31", 390, 530, 349),
    makeEngine("3.0 V6 S/C 380 CP", "Benzina", 380, 460, "Bosch MED17.8.31", 430, 540, 349),
    makeEngine("5.0 V8 S/C 550 CP (F-Type R)", "Benzina", 550, 680, "Bosch MED17.8.31", 600, 740, 549),
  ],
};

const LAND_ROVER_ENGINES = {
  diesel: [
    makeEngine("2.0 TD4 150 CP (Ingenium)", "Diesel", 150, 380, "Bosch EDC17CP55", 195, 450),
    makeEngine("2.0 SD4 240 CP (Ingenium)", "Diesel", 240, 500, "Bosch EDC17CP55", 285, 580),
    makeEngine("2.0d 180 CP (Ingenium)", "Diesel", 180, 430, "Bosch EDC17CP55", 225, 510),
    makeEngine("3.0 TDV6 258 CP", "Diesel", 258, 600, "Bosch EDC17CP55", 310, 690, 349),
    makeEngine("3.0 SDV6 306 CP", "Diesel", 306, 700, "Bosch EDC17CP55", 355, 790, 349),
  ],
  petrol: [
    makeEngine("2.0 Si4 200 CP (Ingenium)", "Benzina", 200, 320, "Bosch MG1CS017", 245, 395),
    makeEngine("2.0 Si4 250 CP (Ingenium)", "Benzina", 250, 365, "Bosch MG1CS017", 295, 435),
    makeEngine("2.0 Si4 300 CP (Ingenium)", "Benzina", 300, 400, "Bosch MG1CS017", 345, 470),
    makeEngine("3.0 V6 S/C 340 CP", "Benzina", 340, 450, "Bosch MED17.8.31", 390, 530, 349),
    makeEngine("3.0 V6 S/C 380 CP", "Benzina", 380, 460, "Bosch MED17.8.31", 430, 540, 349),
    makeEngine("5.0 V8 S/C 510 CP", "Benzina", 510, 625, "Bosch MED17.8.31", 565, 700, 549),
  ],
};

const ALFA_ROMEO_ENGINES = {
  diesel: [
    makeEngine("1.6 JTDm 120 CP", "Diesel", 120, 320, "Bosch EDC17C49", 155, 385),
    makeEngine("2.0 JTDm 150 CP", "Diesel", 150, 380, "Bosch EDC17C49", 190, 445),
    makeEngine("2.0 JTDm 170 CP", "Diesel", 170, 360, "Bosch EDC17C49", 210, 440),
    makeEngine("2.2 JTDm 180 CP", "Diesel", 180, 450, "Bosch EDC17C49", 220, 520),
    makeEngine("2.2 JTDm 210 CP", "Diesel", 210, 470, "Bosch EDC17C49", 255, 545),
  ],
  petrol: [
    makeEngine("1.4 MultiAir 170 CP", "Benzina", 170, 250, "Marelli 8GMF", 205, 310),
    makeEngine("1.75 TBi 200 CP", "Benzina", 200, 320, "Bosch ME7.9.10", 240, 390),
    makeEngine("2.0 Turbo 200 CP", "Benzina", 200, 330, "Bosch MED17.3.5", 245, 400),
    makeEngine("2.0 Turbo 280 CP (Giulia)", "Benzina", 280, 400, "Bosch MED17.3.5", 330, 475),
    makeEngine("2.9 V6 BiTurbo 510 CP (Quadrifoglio)", "Benzina", 510, 600, "Bosch MED17.3.5", 560, 670, 549),
  ],
};

/* ─────────────────────────────────────────────
   BRANDS → MODELS → ENGINES
   ───────────────────────────────────────────── */

function brand(name, logoFile, models) {
  return { name, slug: slug(name), logo: `/logos/${logoFile}`, models };
}

function model(name, years, family, enginesPick) {
  return { name, slug: slug(name), years, modelFamily: family, engines: enginesPick };
}

function pick(family, { diesel = true, petrol = true, dieselFilter, petrolFilter } = {}) {
  let d = diesel && family.diesel ? [...family.diesel] : [];
  let p = petrol && family.petrol ? [...family.petrol] : [];
  if (dieselFilter) d = d.filter(dieselFilter);
  if (petrolFilter) p = p.filter(petrolFilter);
  return [...d, ...p].filter((e) => e.price > 0); // exclude price=0 (NA engines)
}

const smallDiesel = (e) => e.hp <= 150;
const medDiesel = (e) => e.hp >= 100 && e.hp <= 200;
const bigDiesel = (e) => e.hp >= 140;
const smallPetrol = (e) => e.hp <= 160;
const medPetrol = (e) => e.hp >= 100 && e.hp <= 250;
const bigPetrol = (e) => e.hp >= 150;

const brands = [
  /* ─── VAG ─── */
  brand("Volkswagen", "volkswagen.svg", [
    model("Golf VII", "2012-2019", "Golf", pick(VAG_ENGINES)),
    model("Golf VIII", "2019-2024", "Golf", pick(VAG_ENGINES, { dieselFilter: (e) => e.hp >= 110, petrolFilter: (e) => e.hp >= 110 })),
    model("Golf VI", "2008-2012", "Golf", pick(VAG_ENGINES, { dieselFilter: (e) => e.hp <= 170, petrolFilter: (e) => e.hp <= 200 })),
    model("Passat B8", "2014-2023", "Passat", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Passat B7", "2010-2014", "Passat", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: (e) => e.hp >= 100 && e.hp <= 210 })),
    model("Tiguan", "2016-2024", "Tiguan", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Tiguan I", "2007-2016", "Tiguan", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: (e) => e.hp >= 100 && e.hp <= 210 })),
    model("Polo AW", "2017-2024", "Polo", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Polo 6R/6C", "2009-2017", "Polo", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("T-Roc", "2017-2024", "T-Roc", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Touran", "2015-2024", "Touran", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Arteon", "2017-2024", "Arteon", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Caddy", "2015-2024", "Caddy", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Transporter T6", "2015-2024", "Transporter", pick(VAG_ENGINES, { diesel: true, petrol: false, dieselFilter: medDiesel })),
  ]),

  brand("Audi", "audi.svg", [
    model("A3 8V", "2012-2020", "A3", pick(VAG_ENGINES)),
    model("A3 8Y", "2020-2024", "A3", pick(VAG_ENGINES, { dieselFilter: (e) => e.hp >= 110, petrolFilter: (e) => e.hp >= 110 })),
    model("A4 B8", "2007-2015", "A4", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("A4 B9", "2015-2024", "A4", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("A5 F5", "2016-2024", "A5", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("A6 C7", "2011-2018", "A6", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("A6 C8", "2018-2024", "A6", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Q3", "2011-2018", "Q3", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Q3 F3", "2018-2024", "Q3", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Q5 FY", "2016-2024", "Q5", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Q7", "2015-2024", "Q7", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("TT 8S", "2014-2023", "TT", pick(VAG_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
  ]),

  brand("Skoda", "skoda.svg", [
    model("Octavia III", "2012-2020", "Octavia", pick(VAG_ENGINES)),
    model("Octavia IV", "2020-2024", "Octavia", pick(VAG_ENGINES, { dieselFilter: (e) => e.hp >= 110, petrolFilter: (e) => e.hp >= 110 })),
    model("Superb III", "2015-2024", "Superb", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Fabia III", "2014-2021", "Fabia", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Fabia IV", "2021-2024", "Fabia", pick(VAG_ENGINES, { diesel: false, petrolFilter: smallPetrol })),
    model("Karoq", "2017-2024", "Karoq", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Kodiaq", "2016-2024", "Kodiaq", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: bigPetrol })),
    model("Scala", "2018-2024", "Scala", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Kamiq", "2019-2024", "Kamiq", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
  ]),

  brand("Seat", "seat.svg", [
    model("Leon III", "2012-2020", "Leon", pick(VAG_ENGINES)),
    model("Leon IV", "2020-2024", "Leon", pick(VAG_ENGINES, { dieselFilter: (e) => e.hp >= 110, petrolFilter: (e) => e.hp >= 110 })),
    model("Ateca", "2016-2024", "Ateca", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Tarraco", "2018-2024", "Tarraco", pick(VAG_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Ibiza V", "2017-2024", "Ibiza", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Arona", "2017-2024", "Arona", pick(VAG_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
  ]),

  brand("Cupra", "cupra.svg", [
    model("Formentor", "2020-2024", "Formentor", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Leon", "2020-2024", "Leon", pick(VAG_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Ateca", "2018-2024", "Ateca", pick(VAG_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
  ]),

  /* ─── BMW / MINI ─── */
  brand("BMW", "bmw.svg", [
    model("Seria 1 F20/F21", "2011-2019", "1 Series", pick(BMW_ENGINES)),
    model("Seria 1 F40", "2019-2024", "1 Series", pick(BMW_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Seria 2 F22/F23", "2014-2021", "2 Series", pick(BMW_ENGINES)),
    model("Seria 3 F30/F31", "2011-2019", "3 Series", pick(BMW_ENGINES)),
    model("Seria 3 G20/G21", "2019-2024", "3 Series", pick(BMW_ENGINES)),
    model("Seria 4 F32/F33", "2013-2020", "4 Series", pick(BMW_ENGINES, { dieselFilter: medDiesel, petrolFilter: bigPetrol })),
    model("Seria 4 G22/G23", "2020-2024", "4 Series", pick(BMW_ENGINES, { dieselFilter: medDiesel, petrolFilter: bigPetrol })),
    model("Seria 5 F10/F11", "2010-2017", "5 Series", pick(BMW_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Seria 5 G30/G31", "2017-2024", "5 Series", pick(BMW_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("X1 F48", "2015-2022", "X1", pick(BMW_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("X1 U11", "2022-2024", "X1", pick(BMW_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("X3 F25", "2010-2017", "X3", pick(BMW_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("X3 G01", "2017-2024", "X3", pick(BMW_ENGINES)),
    model("X5 F15", "2013-2018", "X5", pick(BMW_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("X5 G05", "2018-2024", "X5", pick(BMW_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
  ]),

  brand("MINI", "mini.svg", [
    model("Cooper F56", "2014-2024", "Cooper", pick(MINI_ENGINES)),
    model("Countryman F60", "2017-2024", "Countryman", pick(MINI_ENGINES)),
    model("Clubman F54", "2015-2024", "Clubman", pick(MINI_ENGINES)),
  ]),

  /* ─── MERCEDES ─── */
  brand("Mercedes-Benz", "mercedes.svg", [
    model("A-Class W176", "2012-2018", "A Class", pick(MERCEDES_ENGINES)),
    model("A-Class W177", "2018-2024", "A Class", pick(MERCEDES_ENGINES)),
    model("C-Class W205", "2014-2021", "C Class", pick(MERCEDES_ENGINES)),
    model("C-Class W206", "2021-2024", "C Class", pick(MERCEDES_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("E-Class W213", "2016-2023", "E Class", pick(MERCEDES_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("GLA X156", "2013-2019", "GLA", pick(MERCEDES_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("GLA H247", "2019-2024", "GLA", pick(MERCEDES_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("GLB X247", "2019-2024", "GLB", pick(MERCEDES_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("GLC X253", "2015-2022", "GLC", pick(MERCEDES_ENGINES)),
    model("GLC X254", "2022-2024", "GLC", pick(MERCEDES_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("GLE W166", "2015-2019", "GLE", pick(MERCEDES_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("GLE W167", "2019-2024", "GLE", pick(MERCEDES_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("CLA C117", "2013-2019", "CLA", pick(MERCEDES_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("CLA C118", "2019-2024", "CLA", pick(MERCEDES_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
  ]),

  /* ─── FORD ─── */
  brand("Ford", "ford.svg", [
    model("Focus III", "2011-2018", "Focus", pick(FORD_ENGINES)),
    model("Focus IV", "2018-2024", "Focus", pick(FORD_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Fiesta VII", "2017-2023", "Fiesta", pick(FORD_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Kuga II", "2012-2019", "Kuga", pick(FORD_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Kuga III", "2019-2024", "Kuga", pick(FORD_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Mondeo V", "2014-2022", "Mondeo", pick(FORD_ENGINES, { dieselFilter: medDiesel, petrolFilter: bigPetrol })),
    model("Puma", "2019-2024", "Puma", pick(FORD_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("EcoSport", "2013-2022", "EcoSport", pick(FORD_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Transit Custom", "2013-2024", "Transit Custom", pick(FORD_ENGINES, { diesel: true, petrol: false, dieselFilter: medDiesel })),
    model("Ranger", "2015-2024", "Ranger", pick(FORD_ENGINES, { diesel: true, petrol: false, dieselFilter: bigDiesel })),
    model("Mustang VI", "2015-2024", "Mustang", pick(FORD_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
  ]),

  /* ─── OPEL ─── */
  brand("Opel", "opel.svg", [
    model("Astra K", "2015-2021", "Astra", pick(OPEL_ENGINES)),
    model("Astra L", "2021-2024", "Astra", pick(OPEL_ENGINES, { dieselFilter: (e) => e.hp >= 105, petrolFilter: (e) => e.hp >= 110 })),
    model("Astra J", "2009-2015", "Astra", pick(OPEL_ENGINES)),
    model("Insignia B", "2017-2024", "Insignia", pick(OPEL_ENGINES, { dieselFilter: medDiesel, petrolFilter: bigPetrol })),
    model("Insignia A", "2008-2017", "Insignia", pick(OPEL_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Corsa F", "2019-2024", "Corsa", pick(OPEL_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Corsa E", "2014-2019", "Corsa", pick(OPEL_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Mokka", "2012-2019", "Mokka", pick(OPEL_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Mokka B", "2020-2024", "Mokka", pick(OPEL_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Crossland", "2017-2024", "Crossland", pick(OPEL_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Grandland", "2017-2024", "Grandland", pick(OPEL_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Zafira C", "2011-2019", "Zafira", pick(OPEL_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
  ]),

  /* ─── RENAULT / DACIA ─── */
  brand("Renault", "renault.svg", [
    model("Megane IV", "2016-2023", "Megane", pick(RENAULT_ENGINES)),
    model("Megane III", "2008-2016", "Megane", pick(RENAULT_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Clio V", "2019-2024", "Clio", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Clio IV", "2012-2019", "Clio", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Captur II", "2019-2024", "Captur", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Captur I", "2013-2019", "Captur", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Kadjar", "2015-2022", "Kadjar", pick(RENAULT_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Talisman", "2015-2022", "Talisman", pick(RENAULT_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Scenic IV", "2016-2022", "Scenic", pick(RENAULT_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Koleos II", "2016-2024", "Koleos", pick(RENAULT_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Master III", "2010-2024", "Master", pick(RENAULT_ENGINES, { diesel: true, petrol: false, dieselFilter: medDiesel })),
    model("Trafic III", "2014-2024", "Trafic", pick(RENAULT_ENGINES, { diesel: true, petrol: false, dieselFilter: medDiesel })),
  ]),

  brand("Dacia", "dacia.svg", [
    model("Duster II", "2018-2024", "Duster", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Duster I", "2010-2018", "Duster", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Logan III", "2020-2024", "Logan", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Sandero III", "2020-2024", "Sandero", pick(RENAULT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Jogger", "2022-2024", "Jogger", pick(RENAULT_ENGINES, { diesel: false, petrolFilter: smallPetrol })),
  ]),

  /* ─── PSA ─── */
  brand("Peugeot", "peugeot.svg", [
    model("308 II", "2013-2021", "308", pick(PSA_ENGINES)),
    model("308 III", "2021-2024", "308", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("208 II", "2019-2024", "208", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("208 I", "2012-2019", "208", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("3008 II", "2016-2024", "3008", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("5008 II", "2017-2024", "5008", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("2008 II", "2019-2024", "2008", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("508 II", "2018-2024", "508", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: bigPetrol })),
    model("Rifter", "2018-2024", "Rifter", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: smallPetrol })),
    model("Partner III", "2018-2024", "Partner", pick(PSA_ENGINES, { diesel: true, petrol: false, dieselFilter: medDiesel })),
  ]),

  brand("Citroen", "citroen.svg", [
    model("C3 III", "2016-2024", "C3", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("C3 Aircross", "2017-2024", "C3 Aircross", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("C4 III", "2020-2024", "C4", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("C4 Cactus", "2014-2020", "C4 Cactus", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("C5 Aircross", "2018-2024", "C5 Aircross", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Berlingo III", "2018-2024", "Berlingo", pick(PSA_ENGINES, { dieselFilter: medDiesel, petrolFilter: smallPetrol })),
    model("C-Elysee", "2012-2020", "C-Elysee", pick(PSA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
  ]),

  /* ─── HYUNDAI / KIA ─── */
  brand("Hyundai", "hyundai.svg", [
    model("Tucson TL", "2015-2020", "Tucson", pick(HYUNDAI_KIA_ENGINES)),
    model("Tucson NX4", "2020-2024", "Tucson", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("i30 PD", "2017-2024", "i30", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("i30 N", "2017-2024", "i30", pick(HYUNDAI_KIA_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
    model("i20 GB", "2020-2024", "i20", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("i20 N", "2021-2024", "i20", pick(HYUNDAI_KIA_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
    model("Kona", "2017-2024", "Kona", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Santa Fe TM", "2018-2024", "Santa Fe", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("ix35", "2010-2015", "ix35", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
  ]),

  brand("Kia", "kia.svg", [
    model("Sportage QL", "2015-2021", "Sportage", pick(HYUNDAI_KIA_ENGINES)),
    model("Sportage NQ5", "2021-2024", "Sportage", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Ceed CD", "2018-2024", "Ceed", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Ceed GT", "2019-2024", "Ceed", pick(HYUNDAI_KIA_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
    model("Stonic", "2017-2024", "Stonic", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Rio YB", "2017-2024", "Rio", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Sorento UM", "2014-2020", "Sorento", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("XCeed", "2019-2024", "XCeed", pick(HYUNDAI_KIA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Stinger", "2017-2024", "Stinger", pick(HYUNDAI_KIA_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
    model("Proceed GT", "2019-2024", "ProCeed", pick(HYUNDAI_KIA_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
  ]),

  /* ─── FIAT / ALFA ─── */
  brand("Fiat", "fiat.svg", [
    model("Tipo", "2016-2024", "Tipo", pick(FIAT_ENGINES)),
    model("500X", "2014-2024", "500X", pick(FIAT_ENGINES)),
    model("500L", "2012-2022", "500L", pick(FIAT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Punto", "2005-2018", "Punto", pick(FIAT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("Ducato III", "2006-2024", "Ducato", pick(FIAT_ENGINES, { diesel: true, petrol: false })),
    model("Doblo II", "2010-2022", "Doblo", pick(FIAT_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
  ]),

  brand("Alfa Romeo", "alfa-romeo.svg", [
    model("Giulietta", "2010-2020", "Giulietta", pick(ALFA_ROMEO_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Giulia", "2016-2024", "Giulia", pick(ALFA_ROMEO_ENGINES)),
    model("Stelvio", "2017-2024", "Stelvio", pick(ALFA_ROMEO_ENGINES)),
    model("MiTo", "2008-2018", "MiTo", pick(ALFA_ROMEO_ENGINES, { dieselFilter: smallDiesel, petrolFilter: (e) => e.hp <= 200 })),
  ]),

  /* ─── VOLVO ─── */
  brand("Volvo", "volvo.svg", [
    model("XC60 II", "2017-2024", "XC60", pick(VOLVO_ENGINES)),
    model("XC60 I", "2008-2017", "XC60", pick(VOLVO_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("XC40", "2017-2024", "XC40", pick(VOLVO_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("XC90 II", "2015-2024", "XC90", pick(VOLVO_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("V40", "2012-2019", "V40", pick(VOLVO_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("V60 II", "2018-2024", "V60", pick(VOLVO_ENGINES)),
    model("V90/S90", "2016-2024", "V90", pick(VOLVO_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
  ]),

  /* ─── TOYOTA ─── */
  brand("Toyota", "toyota.svg", [
    model("Corolla E210", "2018-2024", "Corolla", pick(TOYOTA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Yaris XP210", "2020-2024", "Yaris", pick(TOYOTA_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("C-HR", "2016-2024", "C-HR", pick(TOYOTA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("RAV4 V", "2018-2024", "RAV4", pick(TOYOTA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Hilux VIII", "2015-2024", "Hilux", pick(TOYOTA_ENGINES, { diesel: true, petrol: false, dieselFilter: bigDiesel })),
    model("Land Cruiser J150", "2009-2024", "Land Cruiser", pick(TOYOTA_ENGINES, { diesel: true, petrol: false, dieselFilter: bigDiesel })),
    model("Avensis T27", "2009-2018", "Avensis", pick(TOYOTA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
  ]),

  /* ─── NISSAN ─── */
  brand("Nissan", "nissan.svg", [
    model("Qashqai J11", "2013-2021", "Qashqai", pick(NISSAN_ENGINES)),
    model("Qashqai J12", "2021-2024", "Qashqai", pick(NISSAN_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Juke F16", "2019-2024", "Juke", pick(NISSAN_ENGINES, { diesel: false, petrolFilter: smallPetrol })),
    model("Juke F15", "2010-2019", "Juke", pick(NISSAN_ENGINES, { dieselFilter: smallDiesel, petrolFilter: smallPetrol })),
    model("X-Trail T32", "2014-2022", "X-Trail", pick(NISSAN_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Navara D23", "2015-2024", "Navara", pick(NISSAN_ENGINES, { diesel: true, petrol: false, dieselFilter: bigDiesel })),
  ]),

  /* ─── MAZDA ─── */
  brand("Mazda", "mazda.svg", [
    model("3 BP", "2019-2024", "3", pick(MAZDA_ENGINES)),
    model("3 BM/BN", "2013-2019", "3", pick(MAZDA_ENGINES)),
    model("6 GL", "2018-2024", "6", pick(MAZDA_ENGINES)),
    model("CX-5 KF", "2017-2024", "CX-5", pick(MAZDA_ENGINES)),
    model("CX-30", "2019-2024", "CX-30", pick(MAZDA_ENGINES)),
    model("MX-5 ND", "2015-2024", "MX-5", pick(MAZDA_ENGINES, { diesel: false })),
  ]),

  /* ─── HONDA ─── */
  brand("Honda", "honda.svg", [
    model("Civic X", "2017-2022", "Civic", pick(HONDA_ENGINES)),
    model("Civic XI", "2022-2024", "Civic", pick(HONDA_ENGINES, { diesel: false })),
    model("CR-V V", "2017-2024", "CR-V", pick(HONDA_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("HR-V II", "2015-2022", "HR-V", pick(HONDA_ENGINES, { dieselFilter: medDiesel, petrolFilter: (e) => e.hp <= 200 })),
    model("Civic Type R FK8", "2017-2021", "Civic", [
      ...HONDA_ENGINES.petrol.filter((e) => e.hp >= 300),
    ]),
  ]),

  /* ─── SUZUKI ─── */
  brand("Suzuki", "suzuki.svg", [
    model("Vitara IV", "2015-2024", "Vitara", pick(SUZUKI_ENGINES)),
    model("S-Cross II", "2022-2024", "S-Cross", pick(SUZUKI_ENGINES)),
    model("Swift VI", "2017-2024", "Swift", pick(SUZUKI_ENGINES, { petrolFilter: smallPetrol })),
    model("Jimny IV", "2018-2024", "Jimny", pick(SUZUKI_ENGINES, { diesel: false, petrolFilter: smallPetrol })),
  ]),

  /* ─── MITSUBISHI ─── */
  brand("Mitsubishi", "mitsubishi.svg", [
    model("ASX", "2010-2024", "ASX", pick(MITSUBISHI_ENGINES)),
    model("Outlander III", "2012-2022", "Outlander", pick(MITSUBISHI_ENGINES)),
    model("Eclipse Cross", "2018-2024", "Eclipse Cross", pick(MITSUBISHI_ENGINES)),
    model("L200 V", "2015-2024", "L200", pick(MITSUBISHI_ENGINES, { diesel: true, petrol: false })),
  ]),

  /* ─── PORSCHE ─── */
  brand("Porsche", "porsche.svg", [
    model("Macan", "2014-2024", "Macan", pick(PORSCHE_ENGINES)),
    model("Cayenne III", "2018-2024", "Cayenne", pick(PORSCHE_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Cayenne II", "2010-2018", "Cayenne", pick(PORSCHE_ENGINES)),
    model("Panamera II", "2016-2024", "Panamera", pick(PORSCHE_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
    model("718 Cayman/Boxster", "2016-2024", "718", pick(PORSCHE_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
    model("911 991", "2011-2019", "911", pick(PORSCHE_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
  ]),

  /* ─── JAGUAR / LAND ROVER ─── */
  brand("Jaguar", "jaguar.svg", [
    model("XE", "2015-2024", "XE", pick(JAGUAR_ENGINES)),
    model("XF X260", "2015-2024", "XF", pick(JAGUAR_ENGINES)),
    model("F-Pace", "2016-2024", "F-Pace", pick(JAGUAR_ENGINES)),
    model("E-Pace", "2017-2024", "E-Pace", pick(JAGUAR_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("F-Type", "2013-2024", "F-Type", pick(JAGUAR_ENGINES, { diesel: false, petrolFilter: bigPetrol })),
  ]),

  brand("Land Rover", "land-rover.svg", [
    model("Range Rover Evoque II", "2019-2024", "Range Rover Evoque", pick(LAND_ROVER_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Range Rover Evoque I", "2011-2019", "Range Rover Evoque", pick(LAND_ROVER_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Range Rover Velar", "2017-2024", "Range Rover Velar", pick(LAND_ROVER_ENGINES)),
    model("Range Rover Sport II", "2014-2022", "Range Rover Sport", pick(LAND_ROVER_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Discovery Sport", "2014-2024", "Discovery Sport", pick(LAND_ROVER_ENGINES, { dieselFilter: medDiesel, petrolFilter: medPetrol })),
    model("Discovery V", "2017-2024", "Discovery", pick(LAND_ROVER_ENGINES, { dieselFilter: bigDiesel, petrolFilter: bigPetrol })),
    model("Defender", "2019-2024", "Defender", pick(LAND_ROVER_ENGINES)),
  ]),
];

/* ─────────────────────────────────────────────
   OUTPUT
   ───────────────────────────────────────────── */

// Count
let totalEngines = 0;
let totalModels = 0;

const output = brands.map((b) => ({
  ...b,
  models: b.models.map((m) => {
    totalModels++;
    totalEngines += m.engines.length;
    return m;
  }),
}));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(output, null, 2), "utf-8");

console.log(`Generated ${OUT}`);
console.log(`  Brands: ${output.length}`);
console.log(`  Models: ${totalModels}`);
console.log(`  Engine entries: ${totalEngines}`);
