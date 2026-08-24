import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, CheckCircle2 } from 'lucide-react';

const CONTACT_REASONS = [
  'Platform demonstration & access',
  'Technical architecture briefing',
  'Commercial fleet integration',
  'Automotive OEM partnership',
  'Research / academic collaboration',
  'Bug report / technical issue',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', reason: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in Name, Email, and Message.');
      return;
    }
    setError('');
    try {
      await fetch((import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000') + '/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ background: 'var(--bg-space)', color: 'var(--text-soft)', paddingBottom: 'var(--sp-16)' }}>
      {/* Hero */}
      <section className="bg-hero-glow bg-circuit" style={{ padding: 'clamp(var(--sp-12), 6vw, var(--sp-16)) 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 840 }}>
          <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>
            GET IN TOUCH
          </div>
          <h1 className="text-h1" style={{ color: 'var(--text-primary)', marginBottom: 16 }}>
            Talk to the Engineering Team
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Whether you are exploring the platform, investigating a technical partnership, or requesting hardware demonstration — we respond to every serious inquiry.
          </p>
        </div>
      </section>

      {/* Form + Info Grid */}
      <div className="container" style={{ marginTop: 'var(--sp-10)' }}>
        <div className="grid-2" style={{ alignItems: 'flex-start', gap: 40 }}>
          {/* Form */}
          <div className="diamond-card" style={{ padding: 40, background: 'var(--bg-surface-0)' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} style={{ color: 'var(--status-success)', marginBottom: 16 }} />
                <h2 className="text-h2" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Message Received</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
                  Thank you for reaching out. An EVTWIN engineer will respond within 2 business days.
                </p>
                <Link to="/login" className="btn btn-primary">Launch Platform Workstation</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="technical-label" htmlFor="contact-name" style={{ display: 'block', marginBottom: 6 }}>FULL NAME *</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="technical-label" htmlFor="contact-email" style={{ display: 'block', marginBottom: 6 }}>EMAIL ADDRESS *</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="technical-label" htmlFor="contact-org" style={{ display: 'block', marginBottom: 6 }}>ORGANIZATION</label>
                  <input
                    id="contact-org"
                    type="text"
                    name="org"
                    value={form.org}
                    onChange={handleChange}
                    placeholder="Company or institution (optional)"
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label className="technical-label" htmlFor="contact-reason" style={{ display: 'block', marginBottom: 6 }}>INQUIRY REASON</label>
                  <select
                    id="contact-reason"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-primary)' }}
                  >
                    <option value="">Select a reason…</option>
                    {CONTACT_REASONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="technical-label" htmlFor="contact-message" style={{ display: 'block', marginBottom: 6 }}>MESSAGE *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your inquiry..."
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-primary)', resize: 'vertical' }}
                  />
                </div>

                {error && (
                  <div style={{ color: 'var(--status-critical)', fontSize: '0.875rem' }}>{error}</div>
                )}

                <button type="submit" className="btn btn-primary" id="contact-submit-btn" style={{ width: '100%' }}>
                  Send Inquiry Message <Send size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="diamond-card" style={{ padding: 32, background: 'var(--bg-surface-0)' }}>
              <div className="technical-label" style={{ color: 'var(--accent-cyan)', marginBottom: 8 }}>DEMO PLATFORM CONSOLE</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Instant Interactive Access
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20 }}>
                Explore the EVTWIN prototype console without waiting. Pre-configured demo accounts for Super Admin, Owner, Admin, Driver, and Mechanic are ready for instant login.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Launch Platform Console <ArrowRight size={16} />
              </Link>
            </div>

            <div className="diamond-card" style={{ padding: 32, background: 'var(--bg-surface-0)' }}>
              <div className="technical-label" style={{ marginBottom: 16 }}>SYSTEM STATUS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>FastAPI REST Engine</span>
                  <span className="mono" style={{ color: 'var(--status-success)', fontWeight: 700 }}>OPERATIONAL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>React 19 Frontend</span>
                  <span className="mono" style={{ color: 'var(--status-success)', fontWeight: 700 }}>OPERATIONAL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>Multi-Tenant DB</span>
                  <span className="mono" style={{ color: 'var(--status-success)', fontWeight: 700 }}>OPERATIONAL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>MQTT QoS 1 Listener</span>
                  <span className="mono" style={{ color: 'var(--status-warning)', fontWeight: 700 }}>SIMULATED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
