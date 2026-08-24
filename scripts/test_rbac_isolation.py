import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

def login(email, password):
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    if res.status_code == 200:
        return res.json()["access_token"]
    return None

def test_rbac():
    print("Testing RBAC and Cross-Tenant Security Rules...")
    
    token_superadmin = login("superadmin@evtwin.io", "SuperAdmin123!")
    token_owner = login("owner@acmefleet.com", "Owner123!")
    token_driver = login("driver@acmefleet.com", "Driver123!")
    token_mech = login("mech@acmefleet.com", "Mechanic123!")
    
    assert token_superadmin, "Failed superadmin login"
    assert token_owner, "Failed owner login"
    assert token_driver, "Failed driver login"
    assert token_mech, "Failed mechanic login"
    
    # 1. Super Admin accessing /admin/health -> 200
    res = requests.get(f"{BASE_URL}/admin/health", headers={"Authorization": f"Bearer {token_superadmin}"})
    print(f"SuperAdmin /admin/health: status={res.status_code} (Expected 200)")
    assert res.status_code == 200
    
    # 2. Company Owner accessing /admin/health -> 403 Forbidden
    res = requests.get(f"{BASE_URL}/admin/health", headers={"Authorization": f"Bearer {token_owner}"})
    print(f"CompanyOwner /admin/health: status={res.status_code} (Expected 403)")
    assert res.status_code == 403
    
    # 3. Driver accessing /admin/health -> 403 Forbidden
    res = requests.get(f"{BASE_URL}/admin/health", headers={"Authorization": f"Bearer {token_driver}"})
    print(f"Driver /admin/health: status={res.status_code} (Expected 403)")
    assert res.status_code == 403
    
    # 4. Driver accessing assigned vehicle EV001 -> 200
    res = requests.get(f"{BASE_URL}/vehicles/EV001", headers={"Authorization": f"Bearer {token_driver}"})
    print(f"Driver /vehicles/EV001: status={res.status_code} (Expected 200)")
    assert res.status_code == 200
    
    # 5. Driver accessing unassigned vehicle EV002 -> 403 Forbidden
    res = requests.get(f"{BASE_URL}/vehicles/EV002", headers={"Authorization": f"Bearer {token_driver}"})
    print(f"Driver /vehicles/EV002: status={res.status_code} (Expected 403)")
    assert res.status_code == 403
    
    # 6. Unauthenticated request to /vehicles -> 403 or 401
    res = requests.get(f"{BASE_URL}/vehicles")
    print(f"Unauthenticated /vehicles: status={res.status_code} (Expected 403/401)")
    assert res.status_code in [401, 403]
    
    print("\nAll 6 RBAC and Tenant Isolation tests passed successfully!")

if __name__ == "__main__":
    test_rbac()
