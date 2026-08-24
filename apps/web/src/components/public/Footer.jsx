import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';

const FOOTER_COLS = [
  {
    title: 'Platform',
    links: [
      { to: '/product',    label: 'What is EVTWIN' },
      { to: '/features',   label: 'Live Telemetry' },
      { to: '/features',   label: 'Digital Twin' },
      { to: '/features',   label: 'Black Box Recorder' },
      { to: '/features',   label: 'Alerts & Diagnostics' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { to: '/solutions', label: 'Fleet Operators' },
      { to: '/solutions', label: 'EV Owners' },
      { to: '/solutions', label: 'Service Centers' },
      { to: '/solutions', label: 'OEM Partners' },
      { to: '/solutions', label: 'Insurance [Planned]' },
    ],
  },
  {
    title: 'Technology',
    links: [
      { to: '/technology', label: 'IoT Architecture' },
      { to: '/technology', label: 'MQTT Pipeline' },
      { to: '/technology', label: 'Data Platform' },
      { to: '/technology', label: 'REST API' },
      { to: '/roadmap',    label: 'Product Roadmap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about',   label: 'About EVTWIN' },
      { to: '/contact', label: 'Contact Us' },
      { to: '/roadmap', label: 'Roadmap' },
    ],
  },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy',    href: '#' },
  { label: 'Terms of Service',  href: '#' },
  { label: 'Data Provenance',   href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        {/* Main grid */}
        <div className="footer-grid">
          {/* Brand column */}
          <div>
            <Link to="/" aria-label="EVTWIN Home" style={{ display: 'inline-block', marginBottom: 'var(--sp-5)' }}>
              <BrandLogo size="md" />
            </Link>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 340, marginBottom: 'var(--sp-5)' }}>
              EVTWIN is a connected EV digital twin platform that provides real-time telemetry,
              predictive diagnostics, and vehicle intelligence for fleet operators and EV owners.
            </p>
            <div className="flex" style={{ gap: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-amber">PROTOTYPE PHASE</span>
              <span className="badge badge-cyan">V1.0 RC</span>
            </div>
          </div>

          {/* Navigation columns */}
          {FOOTER_COLS.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div>
            <span>© {year} EVTWIN. All rights reserved.</span>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
            <span style={{ color: 'var(--amber)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
              ⚠ PROTOTYPE — Not for production use
            </span>
          </div>

          <div className="flex" style={{ gap: 'var(--sp-5)', flexWrap: 'wrap', alignItems: 'center' }}>
            {LEGAL_LINKS.map(({ label, href }) => (
              <a key={label} href={href} style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
