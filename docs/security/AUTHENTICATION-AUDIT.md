# EVTWIN Authentication & Security Architecture Audit

**Status:** Complete Audit & Verification  
**Standard:** Enterprise Automotive IoT & Multi-Tenant RBAC  
**Audit Date:** 2026-08-24  
**Classification:** Internal Technical Architecture & Security Review  

---

## 1. Executive Summary

EVTWIN implements an enterprise-grade, multi-tenant authentication and role-based access control (RBAC) architecture designed for connected electric vehicle fleet operations, digital twin engineering, and telematics telemetry streaming.

The system strictly enforces the principle of least privilege, cryptographic password hashing via PBKDF2 with 100,000 iterations and per-user cryptographic salting, signed JWT access tokens with strict expiration, and tenant-level isolation on all resource endpoints.

---

## 2. Authentication Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
| 1. CLIENT PRESENTATION (React 19 + Vite)                                          |
|    - Login Component (Split Cinematic Screen: 3D EV Visual + Auth Card)          |
|    - Monospace Autocomplete Inputs (email, current-password)                     |
|    - Show/Hide Password Toggle                                                    |
|    - Demo Credentials Drawer (PROTOTYPE Mode Only)                               |
+-----------------------------------------------------------------------------------+
                                         |
                       POST /api/v1/auth/login (JSON Body)
                                         v
+-----------------------------------------------------------------------------------+
| 2. BACKEND API GATEWAY (FastAPI / Uvicorn)                                       |
|    - Case-insensitive, whitespace-trimmed email resolution                        |
|    - Generic "Invalid email or password" error response (Anti-Enumeration)        |
|    - PBKDF2-HMAC-SHA256 (100,000 rounds + 16-byte random salt) verification      |
|    - HS256 JWT generation with sub, role, orgId, userId claims                    |
+-----------------------------------------------------------------------------------+
                                         |
                               Bearer <JWT_TOKEN>
                                         v
+-----------------------------------------------------------------------------------+
| 3. RBAC & TENANT ISOLATION MIDDLEWARE (core/rbac.py)                              |
|    - get_current_user: Validates signature, expiry, and existence in MongoDB     |
|    - require_role([allowed_roles]): Verifies role clearance (Returns 403)        |
|    - verify_tenant_access(user, orgId): Enforces cross-tenant resource boundary   |
|    - Driver-specific vehicle filtering (Restricts to assignedVehicleId)          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| 4. PROTECTED ROLE DASHBOARDS                                                      |
|    - SUPER_ADMIN     -> SuperAdminDashboard (/dashboard, /admin/platform)         |
|    - COMPANY_OWNER   -> OwnerDashboard (/dashboard, /owner)                       |
|    - COMPANY_ADMIN   -> AdminDashboard (/dashboard, /admin/operations)           |
|    - DRIVER          -> DriverDashboard (/dashboard, /driver)                     |
|    - MECHANIC        -> MechanicDashboard (/dashboard, /mechanic)                 |
+-----------------------------------------------------------------------------------+
```

---

## 3. Cryptographic Security Standards

| Layer | Implementation | Security Properties |
|---|---|---|
| **Password Storage** | PBKDF2-HMAC-SHA256 | 100,000 iterations, 16-byte unique cryptographic salt per user. Plaintext passwords never stored. |
| **Session Token** | Signed JWT (HS256) | Encodes user identity, role, orgId, and 8-hour expiration (`ACCESS_TOKEN_EXPIRE_MINUTES = 480`). |
| **Secrets Management** | Environment Variables | `JWT_SECRET` loaded from `config.py` / `.env`. Zero secrets exposed in frontend code. |
| **Error Handling** | Constant-Time Error Pattern | Uniform 401 error message for non-existent users and wrong passwords to eliminate user enumeration timing attacks. |
| **Client Storage** | LocalStorage + In-Memory State | Client-side tokens cleared immediately on logout, expired tokens trapped and redirected. |

---

## 4. Multi-Tenant Role-Based Access Control (RBAC) Matrix

| Endpoint | SUPER_ADMIN | COMPANY_OWNER | COMPANY_ADMIN | DRIVER | MECHANIC |
|---|:---:|:---:|:---:|:---:|:---:|
| `POST /api/v1/auth/login` | ✅ Public | ✅ Public | ✅ Public | ✅ Public | ✅ Public |
| `GET /api/v1/auth/me` | ✅ Self | ✅ Self | ✅ Self | ✅ Self | ✅ Self |
| `GET /api/v1/admin/health` | ✅ Full | ❌ 403 | ❌ 403 | ❌ 403 | ❌ 403 |
| `GET /api/v1/admin/audit` | ✅ Full | ❌ 403 | ❌ 403 | ❌ 403 | ❌ 403 |
| `GET /api/v1/organizations` | ✅ All Orgs | ❌ 403 | ❌ 403 | ❌ 403 | ❌ 403 |
| `GET /api/v1/users` | ✅ Global | ✅ Tenant | ✅ Tenant | ❌ 403 | ❌ 403 |
| `GET /api/v1/vehicles` | ✅ Global | ✅ Tenant | ✅ Tenant | ✅ Assigned Only | ✅ Tenant |
| `GET /api/v1/vehicles/{id}` | ✅ Any | ✅ Tenant Only | ✅ Tenant Only | ✅ Assigned Only | ✅ Tenant Only |
| `GET /api/v1/maintenance` | ✅ Global | ✅ Tenant | ✅ Tenant | ❌ 403 | ✅ Tenant Work Orders |
| `GET /api/v1/alerts` | ✅ Global | ✅ Tenant | ✅ Tenant | ❌ 403 | ✅ Tenant Diagnostics |

---

## 5. Identified Defects & Resolutions (Audit Remediation)

1. **Defect SEC-01: Form Data vs JSON Payload Mismatch**
   - *Issue:* Frontend `Login.jsx` was transmitting `x-www-form-urlencoded` with key `username`, while backend FastAPI `LoginRequest` expected `application/json` with keys `email` and `password`.
   - *Fix:* Rebuilt `Login.jsx` to transmit standard JSON payload `{"email": email, "password": password}` with `Content-Type: application/json`.
2. **Defect SEC-02: User Account Seeding Desynchronization**
   - *Issue:* Seed database was conditionally populated only when collection count was 0, causing newly added prototype accounts to not seed on existing databases.
   - *Fix:* Updated `database.py` with an upsert loop for all 5 demo roles across both `@acmefleet.com`, `@evtwin.io`, and `@evtwin.com` domains.
3. **Defect SEC-03: Visual Identity Disconnect on Login**
   - *Issue:* Login page previously had a redundant marketing header bar and lacked the cinematic 3D automotive hero visuals.
   - *Fix:* Converted `/login` into a standalone route with a split screen: left-side 3D Connected EV visual with glowing telemetry wireframe, and right-side dark cockpit authentication card.
4. **Defect SEC-04: Role Elevation Prevention**
   - *Issue:* Frontend role claims must never be accepted blindly.
   - *Fix:* Backend `/auth/login` extracts verified role from database record, embeds role in signed JWT, and RBAC middleware independently verifies token claims and database state on every privileged request.
