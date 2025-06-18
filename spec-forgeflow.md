▶️ BEGIN SPEC ◀️
# Project Name  
**ForgeFlow 🇨🇦 – Welding & Fabrication Shop Management Suite**

---

## 1 Target Users
* Welding, machining, and custom-fabrication shops across **Canada** (solo to enterprise).  
* Field crews operating **mobile welding trucks** for on-site repair & install work.

---

## 2 Regulatory & Canadian Requirements
* **CWB / CSA W47.1 & W59** compliance; welder-cert tracking.  
* **Metric-first**; imperial toggle.  
* **English + French** UI strings (i18n scaffolding).  
* **GST/HST & PST** support (auto-detect by customer province).  
* CRA-compatible **payroll export** (CSV + XML) with province-specific OT rules.  
* Optional **WHMIS & safety-talk** log module.

---

## 3 Core Modules & Tables
| # | Module | Primary Tables (↔ relations) | Key Fields / Notes |
|---|--------|-----------------------------|--------------------|
| 1 | Auth & Roles | `users`, `roles`, `sessions` | Owner, PM, Shop Lead, Welder, Apprentice, Inspector, Customer |
| 2 | Jobs | `jobs` → `job_phases` → `tasks` | Phases: Cut, Fit-Up, Weld, Grind, Paint, QA, Delivery |
| 3 | Drawings & BOM | `drawings`, `bom_items` | DWG/DXF file, revision #, client approval flag |
| 4 | Materials | `materials`, `heat_batches`, `stock_locations` | Heat #, MTR PDF, remnant tracking |
| 5 | Labour & Time | `timecards`, `weld_passes` | Welder ID, WPS ID, amps/volts, travel time |
| 6 | WPS / PQR | `wps_specs`, `pqr_tests`, `welder_certs` | Auto-expiry alerts (30/7/1 days) |
| 7 | Quality & NDT | `inspections`, `weld_logs`, `repair_logs` | VT/UT/RT/PT result, repaired? |
| 8 | Inventory & POs | `purchase_orders`, `po_items`, `vendors` | Plate-nesting optimisation flag |
| 9 | Billing | `estimates`, `invoices`, `invoice_lines`, `payments` | Progress billing %, multi-tax |
|10 | Equipment Maint. | `equipment`, `service_logs` | Welders, trucks, cranes |
|11 | Dispatch & Field | `work_orders`, `truck_trips`, `gps_events` | Geo-timestamp, photos, e-sign |
|12 | Reporting | KPI views: GP, labour variance, weld-repair %, efficiency |

---

## 4 User Journeys

### 4.1 Shop-Floor Job Flow
1. **Estimate → Job** (e-sign)  
2. **Phase Kanban** (barcode/drag)  
3. **Timecard** per phase, WPS picker  
4. **QA** upload NDT, flag repairs  
5. **Invoice** (progress or T&M) with auto GST/HST

### 4.2 Mobile Welding Truck Flow
1. **Dispatch** creates Work-Order with address & priority  
2. **Truck App** (offline Expo)  
   * Turn-by-turn Mapbox nav  
   * On-arrival → start labour clock, GPS stamp  
   * Pick consumables from truck stock  
   * Capture photos & customer e-signature  
   * Sync to office → Invoice draft

---

## 5 Screens / Components
| Screen | Components |
|--------|------------|
| Job Board | Kanban, filters, real-time badges |
| Job Detail | Phase tabs, Drawing viewer, BOM table, mini-Gantt |
| Timecard Kiosk | QR scan, WPS dropdown, notes |
| Material Intake | Barcode scan, heat-lot form, MTR upload |
| WPS Library | Search, expiry badges |
| Weld Log | Weld #, joint, NDT attachment |
| Truck Dispatch | Map list, route ETA, swipe-complete |
| Inspector Portal | X-ray viewer, pass/fail, sign-off |
| Owner Dashboard | KPI tiles, charts (Chart.js) |

---

## 6 Tech Stack Directives
* **Monorepo** (pnpm workspaces)  
* **Backend**: Node + NestJS *or* FastAPI → PostgreSQL (Supabase) → Prisma  
* **Auth**: Supabase with RLS + JWT  
* **Storage**: S3-compatible (Supabase Storage)  
* **Realtime**: Supabase Realtime websockets  
* **Web Frontend**: Next.js 14 (App Router) + shadcn/ui + Tailwind  
* **Mobile**: Expo React Native (`apps/mobile`), shared TS models  
* **Offline**: React Query + SQLite driver, background sync  
* **Mapping**: Mapbox RN & serverless reverse-geocode  
* **CI/CD**: GitHub Actions → Vercel (web) & EAS Build (mobile)  
* **Tests**: Vitest, Playwright, Detox  
* **i18n**: next-intl + Expo Localization (en ↔ fr)  
* **Payments**: Stripe Canada (ACH/cards)  
* **Accounting**: QuickBooks Online CA (OAuth2, province tax map)

---

## 7 Sample API Contracts
~~~ts
// POST /api/v1/jobs
type CreateJobBody = {
  clientId: string;
  title: string;
  phaseOrder?: string[];
  quoteId?: string;
  dueDate?: string; // ISO
};

// GET /api/v1/wps/:id
type WpsResponse = {
  id: string;
  code: string; // e.g. "W47.1-GMAW-Flat"
  materialGroup: string;
  positions: string[];
  parameters: { amps: number; volts: number; wireFeed?: number };
  pdfUrl: string;
};

// POST /api/v1/dispatch/truckTrip/start
type StartTripBody = {
  workOrderId: string;
  odometerStart: number;
  gpsStart: { lat: number; lng: number };
};
~~~

---

## 8 Seed Data & Fixtures
* 4 demo Customers, 2 Vendors, 8 WPS records (steel, SS, AL).  
* 1 welding truck with rod & gas stock.  
* 3 Jobs: *Structural Beam*, *Handrail*, *Repair-on-Site*.

---

## 9 Provincial Overtime Rules
| Province | Daily OT | Weekly OT |
|----------|----------|-----------|
| AB | \>8 h → 1.5× | \>44 h → 1.5× |
| BC | \>8 h → 1.5×; \>12 h → 2× | \>40 h → 1.5× |
| ON | – | \>44 h → 1.5× |

---

## 10 Roadmap (Claude, plan milestones)
1. **Week 1** – Schema, Auth, Job Board (web)  
2. **Week 2** – Timecards, Materials, PO flow  
3. **Week 3** – WPS & Certs, QA module, Reports  
4. **Week 4** – Mobile Truck App, GPS, photos  
5. **Week 5** – Billing, Payments, QuickBooks, CRA payroll  
6. **Week 6** – French i18n, CSA audit, prod hardening

---

### Claude, please:
1. Scaffold the monorepo with modules, tables & screens above.  
2. Generate Prisma schema + Supabase SQL migrations.  
3. Produce initial UI components with shadcn/ui & responsive layouts.  
4. Stub out the mobile app with shared models and offline cache.  
5. Add sample data & GitHub Actions workflow.  
6. Reply with repo folder tree, key files, and next steps.
▶️ END SPEC ◀️
