# EVTWIN Authentication & RBAC Test Suite (AUTH-001 through AUTH-025)

**Test Status:** 25/25 Verified Automated Test Specifications  
**Environment:** Headless Selenium Chrome + PyTest + Requests  
**Date:** 2026-08-24  

---

## 1. Test Execution Matrix

| Test ID | Scenario Description | Input Data | Expected Result | Automated Status |
|---|---|---|---|:---:|
| **AUTH-001** | Super Admin Authentication | `superadmin@evtwin.io` / `SuperAdmin123!` | 200 OK, JWT returned, role=`SUPER_ADMIN`, routes to SuperAdmin Platform Dashboard | ✅ **PASS** |
| **AUTH-002** | Company Owner Authentication | `owner@acmefleet.com` / `Owner123!` | 200 OK, JWT returned, role=`COMPANY_OWNER`, routes to Owner Fleet Dashboard | ✅ **PASS** |
| **AUTH-003** | Company Admin Authentication | `admin@acmefleet.com` / `Admin123!` | 200 OK, JWT returned, role=`COMPANY_ADMIN`, routes to Operations Command Dashboard | ✅ **PASS** |
| **AUTH-004** | Driver Authentication | `driver@acmefleet.com` / `Driver123!` | 200 OK, JWT returned, role=`DRIVER`, routes to Driver Vehicle Terminal | ✅ **PASS** |
| **AUTH-005** | Mechanic Authentication | `mech@acmefleet.com` / `Mechanic123!` | 200 OK, JWT returned, role=`MECHANIC`, routes to Service Diagnostics Station | ✅ **PASS** |
| **AUTH-006** | Invalid Password | `owner@acmefleet.com` / `WrongPass999` | 401 Unauthorized, "Invalid email or password", no token generated | ✅ **PASS** |
| **AUTH-007** | Invalid Email | `ghost@unknowncorp.com` / `Password123!` | 401 Unauthorized, "Invalid email or password", anti-enumeration enforced | ✅ **PASS** |
| **AUTH-008** | Client Validation: Empty Email | `""` / `Password123!` | Form error displayed: "Please enter your email and password.", no API request | ✅ **PASS** |
| **AUTH-009** | Client Validation: Empty Password | `owner@acmefleet.com` / `""` | Form error displayed: "Please enter your email and password.", no API request | ✅ **PASS** |
| **AUTH-010** | Client Validation: Both Empty | `""` / `""` | Immediate client validation error, submit disabled/prevented | ✅ **PASS** |
| **AUTH-011** | Logout Execution | Click `#sidebar-signout-btn` | `localStorage` token/user cleared, state reset, redirected to `/login` | ✅ **PASS** |
| **AUTH-012** | Unauthenticated Route Protection | Navigate directly to `/dashboard` | Direct redirect to `/login` | ✅ **PASS** |
| **AUTH-013** | Company Owner Forbidden Admin Resource | Request `GET /api/v1/admin/health` with Owner token | Backend returns 403 Forbidden: Role not authorized | ✅ **PASS** |
| **AUTH-014** | Driver Forbidden Admin Resource | Request `GET /api/v1/admin/health` with Driver token | Backend returns 403 Forbidden: Role not authorized | ✅ **PASS** |
| **AUTH-015** | Mechanic Forbidden Admin Resource | Request `GET /api/v1/admin/health` with Mechanic token | Backend returns 403 Forbidden: Role not authorized | ✅ **PASS** |
| **AUTH-016** | Cross-Tenant Vehicle Access | Driver requests unassigned vehicle `EV002` | Backend returns 403 Forbidden: Cross-tenant / unauthorized vehicle | ✅ **PASS** |
| **AUTH-017** | Driver Assigned Vehicle Access | Driver requests assigned vehicle `EV001` | Backend returns 200 OK with vehicle telemetry | ✅ **PASS** |
| **AUTH-018** | API Server Connection Error Handling | Backend simulated offline | User-friendly error message: "Unable to reach the platform server" | ✅ **PASS** |
| **AUTH-019** | Duplicate Submission Prevention | Double-click Submit button | Button enters `loading` state, duplicate request blocked | ✅ **PASS** |
| **AUTH-020** | Session Restoration on Page Reload | Refresh browser with active token | State rehydrated from `localStorage` without prompt | ✅ **PASS** |
| **AUTH-021** | Browser Back After Logout | Press Browser Back after logout | Protected dashboard remains inaccessible; redirects to `/login` | ✅ **PASS** |
| **AUTH-022** | Mobile Login Layout | Viewport 390x844 (iPhone 12/13/14) | Split-screen stacks into hero badge + compact accessible form | ✅ **PASS** |
| **AUTH-023** | Keyboard-Only Navigation | Tab through inputs and press Enter | Focus visible, Enter key executes submission | ✅ **PASS** |
| **AUTH-024** | Dark Mode Theme Integrity | Default dark theme | Deep graphite (`#05070f`), midnight surfaces, electric cyan glow | ✅ **PASS** |
| **AUTH-025** | Demo Credentials Drawer | Click "PROTOTYPE Demo Credentials" | Drawer expands/collapses smoothly, auto-fills form inputs | ✅ **PASS** |
