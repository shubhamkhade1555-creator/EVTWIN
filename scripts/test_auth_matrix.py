import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

TEST_MATRIX = [
    ("superadmin@evtwin.io", "SuperAdmin123!", "SUPER_ADMIN", 200),
    ("owner@acmefleet.com", "Owner123!", "COMPANY_OWNER", 200),
    ("admin@acmefleet.com", "Admin123!", "COMPANY_ADMIN", 200),
    ("driver@acmefleet.com", "Driver123!", "DRIVER", 200),
    ("mech@acmefleet.com", "Mechanic123!", "MECHANIC", 200),
    ("owner@acmefleet.com", "WrongPassword999", None, 401),
    ("nonexistent@user.com", "Password123!", None, 401),
]

def main():
    print("Executing comprehensive authentication test matrix...")
    passed = 0
    total = len(TEST_MATRIX)
    
    for email, password, expected_role, expected_status in TEST_MATRIX:
        res = requests.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
        status_ok = (res.status_code == expected_status)
        
        if expected_status == 200:
            data = res.json()
            role_ok = (data.get("role") == expected_role)
            token = data.get("access_token")
            # Test /auth/me with Bearer token
            me_res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
            me_ok = (me_res.status_code == 200 and me_res.json().get("role") == expected_role)
            
            if status_ok and role_ok and me_ok:
                passed += 1
                print(f"[PASS] {email} -> Role: {expected_role}, User: '{me_res.json().get('name')}'")
            else:
                print(f"[FAIL] {email} -> status={res.status_code}, role={data.get('role')}, me_status={me_res.status_code}")
        else:
            if status_ok:
                passed += 1
                print(f"[PASS - Expected 401] {email} -> status={res.status_code}, detail='{res.json().get('detail')}'")
            else:
                print(f"[FAIL] {email} -> expected {expected_status}, got {res.status_code}")

    print(f"\nResult: {passed}/{total} tests passed.")

if __name__ == "__main__":
    main()
