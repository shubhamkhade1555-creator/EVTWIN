import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

ACCOUNTS = [
    ("superadmin@evtwin.com", "password123", "SUPER_ADMIN"),
    ("owner@evtwin.com", "password123", "COMPANY_OWNER"),
    ("admin@evtwin.com", "password123", "COMPANY_ADMIN"),
    ("driver@evtwin.com", "password123", "DRIVER"),
    ("mechanic@evtwin.com", "password123", "MECHANIC"),
]

def main():
    print("Testing backend authentication API...")
    for email, password, expected_role in ACCOUNTS:
        payload = {"email": email, "password": password}
        try:
            res = requests.post(f"{BASE_URL}/auth/login", json=payload)
            print(f"Login {email}: status={res.status_code}")
            if res.status_code == 200:
                data = res.json()
                print(f"  -> Token received! Role: {data.get('role')} (Expected: {expected_role})")
                token = data.get("access_token")
                # Test /auth/me
                me_res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
                print(f"  -> /auth/me status={me_res.status_code}, User: {me_res.json().get('name')}")
            else:
                print(f"  -> Error: {res.text}")
        except Exception as e:
            print(f"  -> Connection error: {e}")

if __name__ == "__main__":
    main()
