# EVTWIN Frontend UI/UX Comprehensive Test Specifications

**Version:** 1.0.0 (Enterprise Specification)  
**Governance Authority:** `EVTWIN/docs/MASTER-PRODUCT-SYSTEM-TRUTH.md`  
**Test Categories:** A through X (24 Categories)  
**Priority Legend:** `P0` (Critical) • `P1` (Major) • `P2` (Important) • `P3` (Polish)

---

## Category A: Visual Design & Hierarchy

### UI-VIS-001: First Viewport Brand & Value Articulation
- **Category:** Visual Design
- **Page:** `/` (Home)
- **Role:** Anonymous Visitor
- **Precondition:** Browser open at 1440×900 viewport.
- **Steps:** Load `http://127.0.0.1:5173/`. Observe hero section above the fold.
- **Expected Result:** Clear brand lockup, headline stating EV intelligence & connected telemetry, primary CTA ("Access Platform"), secondary CTA ("Explore Product"), and interactive connected vehicle telemetry visual without vertical clipping.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-VIS-002: Multi-Tier Surface Elevation in Dark Mode
- **Category:** Visual Design
- **Page:** `/dashboard`
- **Role:** Company Owner
- **Precondition:** Authenticated as `owner@evtwin.com`.
- **Steps:** Observe contrast between canvas background, card surfaces, metric boxes, and modal overlays.
- **Expected Result:** Clear visual distinction between `--bg-space` (#06080d), `--bg-surface-0` (#0a0d14), `--bg-surface-1` (#101522), and elevated cards with 1px border `rgba(255,255,255,0.08)`. No muddy or flat grey appearance.
- **Priority:** `P1`
- **Status:** `SPECIFIED`

---

## Category B: Typography & Tabular Numerals

### UI-TYPO-001: Tabular Monospace Alignment in Telemetry Feeds
- **Category:** Typography
- **Page:** `/vehicles/EV001`
- **Role:** Any Authenticated Role
- **Precondition:** Vehicle details open on *Live Telemetry* tab.
- **Steps:** Trigger telemetry updates. Observe numeric changes in Voltage, Current, Temperature, and SOC.
- **Expected Result:** Numerals use `JetBrains Mono` with fixed-width tabular character spacing. Layout does not jitter or shift horizontally as digits change (e.g. from 48.9V to 49.0V).
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-TYPO-002: Heading Scale Consistency Across Routes
- **Category:** Typography
- **Page:** All Pages
- **Role:** All
- **Precondition:** Clean stylesheet loaded.
- **Steps:** Inspect font sizes for `h1`, `h2`, `h3`, `p`, and caption labels across Public, Dashboard, and Vehicle views.
- **Expected Result:** Strictly conforms to `--font-display`, `--font-h1`, `--font-h2`, `--font-h3`, and `--font-body` tokens with no ad-hoc pixel overrides.
- **Priority:** `P1`
- **Status:** `SPECIFIED`

---

## Category C: Color System & Data Provenance

### UI-COLOR-001: Semantic Status Color Restraint
- **Category:** Color
- **Page:** `/alerts` and `/maintenance`
- **Role:** Fleet Admin / Mechanic
- **Precondition:** Alerts and maintenance tickets loaded.
- **Steps:** Observe severity badges (`CRITICAL`, `WARNING`, `INFO`) and status badges (`NEW`, `ACKNOWLEDGED`, `RESOLVED`, `IN_REPAIR`, `COMPLETED`).
- **Expected Result:** Colors strictly map to `--status-offline` (red), `--status-stale` (amber), `--status-live` (emerald), and `--status-info` (blue). No decorative multi-color rainbow styling.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-COLOR-002: Data Provenance Transparency (Rule 15)
- **Category:** Color & Provenance
- **Page:** `/vehicles/EV001` (Digital Twin Tab)
- **Role:** Any Authenticated Role
- **Precondition:** Tab 4 (Digital Twin) selected.
- **Steps:** Inspect dual-state comparison table.
- **Expected Result:** Measured physical sensors labeled `MEASURED`, computed states labeled `ESTIMATED`, software simulator labeled `SIMULATION`, and AI estimates labeled `PREDICTED` with distinct provenance badge variants.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

---

## Category D: Spacing & Grid System

### UI-SPACE-001: Consistent 8px Spacing Grid
- **Category:** Spacing
- **Page:** All Dashboards
- **Role:** All
- **Precondition:** Dashboard loaded at 1280px.
- **Steps:** Inspect margin and padding of cards, grid gaps, and section headers.
- **Expected Result:** Margins and paddings are multiples of 4px/8px (e.g. 16px, 24px, 32px). No arbitrary values like 19px or 37px.
- **Priority:** `P2`
- **Status:** `SPECIFIED`

---

## Category E: Responsive Breakpoint Matrix

### UI-RESP-001: Mobile Viewport Rendering at 375px
- **Category:** Responsive
- **Page:** `/` (Home), `/login`, `/dashboard`, `/vehicles/EV001`
- **Role:** Driver / Visitor
- **Precondition:** Mobile device simulator or viewport resized to 375px width.
- **Steps:** Navigate through public pages, login, and driver dashboard.
- **Expected Result:** No horizontal scrollbars. Navigation toggles into mobile drawer. Metric cards stack vertically. Circular SOC gauge scales proportionally without clipping.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-RESP-002: Tablet Viewport Layout at 768px and 1024px
- **Category:** Responsive
- **Page:** `/vehicles` and `/dashboard`
- **Role:** Fleet Admin
- **Precondition:** Viewport set to 768px and 1024px width.
- **Steps:** Observe vehicle grid and telemetry charts.
- **Expected Result:** 4-column desktop grids collapse to 2-column grid. Sidebar adapts cleanly without overlapping content.
- **Priority:** `P1`
- **Status:** `SPECIFIED`

---

## Category F: Dark & Light Mode Theme Support

### UI-THEME-001: Dynamic 1-Click Theme Switching
- **Category:** Dark / Light Mode
- **Page:** Header on all pages
- **Role:** All
- **Precondition:** Platform running.
- **Steps:** Click the Theme Switcher button in the header/navbar.
- **Expected Result:** Seamlessly switches between `dark` and `light` mode. Background switches from dark slate to crisp high-contrast off-white (`#f8fafc`). All text, borders, gauges, and SVG charts remain perfectly readable with WCAG AA contrast. Preference persists across browser reload in `localStorage`.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

---

## Category G: Data Visualization & Waveforms

### UI-CHART-001: Interactive Time-Series Telemetry Waveform
- **Category:** Data Visualization
- **Page:** `/vehicles/EV001` (Live Telemetry Tab)
- **Role:** Mechanic / Fleet Owner
- **Precondition:** Vehicle EV001 loaded.
- **Steps:** Hover cursor over SVG telemetry waveform chart points.
- **Expected Result:** Displays interactive tooltip showing exact timestamp (UTC), voltage, current, and temperature. Waveform renders smooth cubic Bezier paths without pixelation.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-CHART-002: Circular Radial SOC & Usable Range Gauge
- **Category:** Data Visualization / Automotive HMI
- **Page:** `/dashboard` (Driver View)
- **Role:** EV Driver (`driver@evtwin.com`)
- **Precondition:** Logged in as Driver.
- **Steps:** Observe SOC instrument gauge. Trigger simulation step to drop SOC.
- **Expected Result:** Circular SVG arc smoothly adjusts fill percentage. Color shifts from cyan/green (>30%) to amber (15-30%) and red (<15%). Large center text shows tabular percentage.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

---

## Category H: Role-Specific UX Journeys

### UI-ROLE-001: Super Admin Command Center Journey
- **Category:** Role-based UX
- **Page:** `/dashboard`
- **Role:** Super Admin (`superadmin@evtwin.com`)
- **Steps:** Sign in as Super Admin. Inspect platform services, broker status, total tenant organizations, and system security audit logs.
- **Expected Result:** Command-center layout with real-time service heartbeats (API, DB, MQTT, Ingestion) and security audit log table with filter capability.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-ROLE-002: Fleet Owner Executive Portfolio Journey
- **Category:** Role-based UX
- **Page:** `/dashboard`
- **Role:** Fleet Owner (`owner@evtwin.com`)
- **Steps:** Sign in as Fleet Owner. Review fleet uptime, total distance traveled, average SOC/SOH, and critical alert tickers.
- **Expected Result:** Business-level executive KPIs, fleet health distribution bars, and direct link to fleet vehicle platform without raw firmware noise.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-ROLE-003: Fleet Operations Admin Journey
- **Category:** Role-based UX
- **Page:** `/dashboard`
- **Role:** Fleet Admin (`admin@evtwin.com`)
- **Steps:** Sign in as Fleet Admin. Review active dispatches, acknowledge a new alert, and create a service dispatch.
- **Expected Result:** Daily operational command view with 1-click alert acknowledgment and instant maintenance ticket modal.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-ROLE-004: EV Driver Distraction-Free Terminal Journey
- **Category:** Role-based UX
- **Page:** `/dashboard`
- **Role:** EV Driver (`driver@evtwin.com`)
- **Steps:** Sign in as Driver. Observe assigned vehicle (`EV001`), click "Start New Trip", confirm route, observe active recording state, then click "Complete & End Trip".
- **Expected Result:** High-contrast ergonomic HUD. Start Trip opens modal, updates status to RUNNING. End Trip calculates final SOC, distance, and energy used.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-ROLE-005: Service Mechanic Diagnostic Workstation Journey
- **Category:** Role-based UX
- **Page:** `/dashboard`
- **Role:** EV Mechanic (`mechanic@evtwin.com`)
- **Steps:** Sign in as Mechanic. Select a high-temperature ticket for `EV004`. Inspect the black-box telemetry evidence trace (51.4°C / 38.5A). Enter root-cause diagnosis, click "In Repair", then verify and click "Resolve Ticket".
- **Expected Result:** Diagnostic split-pane view with historical telemetry snapshots, diagnostic input fields, and verified ticket state transitions.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

---

## Category I: Accessibility & Keyboard Navigation

### UI-A11Y-001: Keyboard Tab Order & Focus Rings
- **Category:** Accessibility
- **Page:** All Pages
- **Role:** All
- **Steps:** Navigate through all links, buttons, form inputs, and tabs using only the `Tab`, `Shift+Tab`, `Enter`, and `Space` keys.
- **Expected Result:** Every interactive element receives a high-contrast visible focus ring (`outline: 2px solid var(--border-focus); outline-offset: 2px`). Tab order is logical top-to-bottom, left-to-right.
- **Priority:** `P0`
- **Status:** `SPECIFIED`

### UI-A11Y-002: Screen Reader Semantics & ARIA Landmarks
- **Category:** Accessibility
- **Page:** `/`, `/dashboard`, `/vehicles/:id`
- **Role:** All
- **Steps:** Inspect HTML structure with accessibility tree inspector.
- **Expected Result:** Semantic `<header>`, `<nav>`, `<main>`, `<aside>`, and `<footer>` elements. Live telemetry status indicators include `aria-live="polite"` and `aria-label="Status: Live"`.
- **Priority:** `P1`
- **Status:** `SPECIFIED`
