# EVTWIN Enterprise Design System & Token Specification

**Version:** 3.0.0 (L5 Automotive Technology & Brand Edition)  
**Primary Brand Anchor:** Official `evtwin_logo.jpg` & `hero_illustration.jpg` Assets  
**Governance Authority:** `EVTWIN/docs/MASTER-PRODUCT-SYSTEM-TRUTH.md`  
**Target Quality Bar:** L5 — Premium Automotive Technology Platform

---

## 1. Visual Identity & Design Philosophy

The EVTWIN design system is derived directly from the official **EVTWIN Brand Identity** (`evtwin_logo.jpg`):
- **Deep Graphite & Dark Navy Canvas**: Providing high-contrast, distraction-free backgrounds that highlight critical electrical and thermal signals.
- **Electric Cyber Cyan / EV Blue**: Employed strategically for primary action calls, live telemetry status dots, SVG waveform strokes, and circuit connection nodes.
- **Precision Automotive Silhouette & Circuit Traces**: Visual metaphors communicating high-voltage battery architecture, microcontroller edge firmware, and cloud digital twin states.
- **Restrained Glowing Luminance**: Subtle ambient glow behind key indicators without excessive neon saturation.
- **Tabular Monospace Numerals (`JetBrains Mono`)**: Jitter-free numeric alignment for real-time telemetry streams (Voltage, Current, Temperature, SOC, RPM, Power).

---

## 2. Token Architecture

### 2.1 Brand & Canvas Color Tokens

```css
/* Brand Colors Derived from Official Logo */
--brand-cyan: #00d2ff;
--brand-cyan-glow: rgba(0, 210, 255, 0.25);
--brand-cyan-hover: #38bdf8;
--brand-blue: #0284c7;
--brand-ice-blue: #7dd3fc;

/* Dark Canvas Surfaces */
--bg-space: #06080e;
--bg-surface-0: #0a0e17;
--bg-surface-1: #101624;
--bg-surface-2: #161f32;
--bg-surface-3: #1e2a44;
--bg-surface-elevated: #1a243a;
--bg-overlay: rgba(6, 8, 14, 0.88);

/* Typography */
--text-primary: #ffffff;
--text-soft: #f8fafc;
--text-secondary: #94a3b8;
--text-muted: #64748b;
--text-inverse: #030712;

/* Semantic State Colors */
--status-live: #10b981;
--status-stale: #f59e0b;
--status-offline: #ef4444;
--status-info: #3b82f6;
--status-twin: #a855f7;
```

---

## 3. Core Component Library Specifications

| Component | Responsibility | Technical Implementation |
|---|---|---|
| **`BrandLogo`** | Renders the official EVTWIN brand logo asset (`evtwin_logo.jpg`) with fallback handling. | `src/components/ui/BrandLogo.jsx` |
| **`RadialGauge`** | 270° circular SVG instrument dial with dynamic color sectors and center tabular numerals. | `src/components/ui/RadialGauge.jsx` |
| **`TimeSeriesChart`** | Smooth SVG cubic-Bezier waveform chart with interactive hover crosshairs and tooltips. | `src/components/ui/TimeSeriesChart.jsx` |
| **`MetricCard`** | Telemetry metric card with dynamic progress/tolerance bar and trend indicators. | `src/components/ui/MetricCard.jsx` |
| **`Breadcrumb`** | Accessible navigation path for deep telemetry hierarchy. | `src/components/ui/Breadcrumb.jsx` |
| **`Modal`** | Accessible dialog overlay with backdrop blur, focus trap, and ESC key listener. | `src/components/ui/Modal.jsx` |
| **`ThemeToggle`** | 1-click switcher between Light and Dark mode with `localStorage` persistence. | `src/components/ui/ThemeToggle.jsx` |
| **`ProvenanceTag`** | Rule 15 data origin badge (`MEASURED`, `ESTIMATED`, `SIMULATED`, `PREDICTED`). | `src/components/ui/ProvenanceTag.jsx` |
