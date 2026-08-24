# EVTWIN Prototype Demo Credentials Reference

**Classification:** DEVELOPMENT / PROTOTYPE ENVIRONMENT ONLY  
**Security Warning:** These accounts are pre-configured test fixtures for prototype validation only. Plaintext credentials are never deployed to production environments.  

---

## 1. Prototype Roles & Credentials Directory

| Role | Email Address | Prototype Password | Default Organization | Assigned Scope | Target Workstation |
|---|---|---|---|---|---|
| **Super Admin** | `superadmin@evtwin.io` | `SuperAdmin123!` | Platform Global | Global multi-tenant visibility, system health, audit logs | Platform Super Admin Console (`/dashboard`) |
| **Company Owner** | `owner@acmefleet.com` | `Owner123!` | Apex Logistics (`ORG001`) | Executive fleet management, financial metrics, fleet-wide battery health | Executive Fleet Cockpit (`/dashboard`) |
| **Company Admin** | `admin@acmefleet.com` | `Admin123!` | Apex Logistics (`ORG001`) | Operational vehicle dispatches, alert triage, maintenance work orders | Operations Command (`/dashboard`) |
| **Driver** | `driver@acmefleet.com` | `Driver123!` | Apex Logistics (`ORG001`) | Assigned vehicle telemetry (`EV001`), drive cycle score, trip logs | Driver Telemetry Terminal (`/dashboard`) |
| **Mechanic** | `mech@acmefleet.com` | `Mechanic123!` | Apex Logistics (`ORG001`) | Work orders, live battery pack cell diagnostics, DTC fault clearing | Service Diagnostics Station (`/dashboard`) |

> [!NOTE]
> For testing flexibility in development mode, `password123` is also accepted across all seeded prototype accounts.

---

## 2. Cryptographic Verification Mechanics

- **Hash Algorithm:** PBKDF2 with HMAC-SHA256
- **Work Factor:** 100,000 rounds
- **Salt:** 16-byte cryptographically secure random salt per account
- **Token Format:** Signed JSON Web Token (JWT) using HS256 with 480-minute (8 hour) validity
- **Verification Endpoint:** `POST /api/v1/auth/login`
- **Identity Endpoint:** `GET /api/v1/auth/me`
