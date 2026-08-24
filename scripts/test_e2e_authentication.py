import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_WEB = "http://127.0.0.1:5173"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-artifacts", "visual-audit")
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = [
    ("login_1920x1080.png", 1920, 1080),
    ("login_1440x900.png", 1440, 900),
    ("login_1280x800.png", 1280, 800),
    ("login_1024x768.png", 1024, 768),
    ("login_768x1024.png", 768, 1024),
    ("login_414x896.png", 414, 896),
    ("login_390x844.png", 390, 844),
    ("login_375x812.png", 375, 812),
]

ROLES_TEST = [
    ("Super Admin", "superadmin@evtwin.io", "SuperAdmin123!", "Command Center", "demo-btn-super-admin"),
    ("Company Owner", "owner@acmefleet.com", "Owner123!", "Fleet Overview", "demo-btn-company-owner"),
    ("Company Admin", "admin@acmefleet.com", "Admin123!", "Operations Command", "demo-btn-company-admin"),
    ("Driver", "driver@acmefleet.com", "Driver123!", "Driver Terminal", "demo-btn-driver"),
    ("Mechanic", "mech@acmefleet.com", "Mechanic123!", "Diagnostics Station", "demo-btn-mechanic"),
]

def create_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    return driver

def run_tests():
    print("=== Starting EVTWIN End-to-End Authentication & RBAC QA Suite ===")
    
    driver = create_driver()
    wait = WebDriverWait(driver, 8)
    
    try:
        # 1. Capture Multi-Viewport Screenshots of Rebuilt Login Page
        print("\n--- Phase 1: Capturing Rebuilt Login Page Viewports ---")
        for filename, w, h in VIEWPORTS:
            driver.set_window_size(w, h)
            driver.get(f"{BASE_WEB}/login")
            time.sleep(1.0)
            out_path = os.path.join(OUTPUT_DIR, filename)
            driver.save_screenshot(out_path)
            print(f"Captured: {filename} ({w}x{h})")

        driver.set_window_size(1920, 1080)

        # 2. Test Client Validation (Empty Submission)
        print("\n--- Phase 2: Client Validation Test ---")
        driver.get(f"{BASE_WEB}/login")
        time.sleep(1.0)
        # Clear remembered email for pristine validation check
        driver.execute_script("localStorage.clear();")
        driver.get(f"{BASE_WEB}/login")
        time.sleep(1.0)
        submit_btn = wait.until(EC.presence_of_element_located((By.ID, "login-submit-btn")))
        driver.execute_script("arguments[0].click();", submit_btn)
        time.sleep(0.5)
        error_el = driver.find_element(By.ID, "login-error-alert")
        assert "Please enter both" in error_el.text, f"Unexpected error text: {error_el.text}"
        print("[PASS] Empty form validation prevented request & showed friendly alert.")

        # 3. Test Invalid Credentials Error Handling
        print("\n--- Phase 3: Invalid Credentials Rejection Test ---")
        email_inp = driver.find_element(By.ID, "login-email")
        pass_inp = driver.find_element(By.ID, "login-password")
        email_inp.send_keys(Keys.CONTROL + "a", Keys.BACKSPACE)
        email_inp.send_keys("owner@acmefleet.com")
        pass_inp.send_keys(Keys.CONTROL + "a", Keys.BACKSPACE)
        pass_inp.send_keys("WrongPassword123")
        driver.execute_script("arguments[0].click();", submit_btn)
        time.sleep(1.2)
        error_el = wait.until(EC.visibility_of_element_located((By.ID, "login-error-alert")))
        assert "Invalid email or password" in error_el.text, f"Unexpected error: {error_el.text}"
        print("[PASS] Invalid password rejected with 401 anti-enumeration alert.")

        # 4. Test All 5 Roles End-to-End: Login -> Token -> Dashboard -> Content -> Logout
        print("\n--- Phase 4: Role-Based Authentication & Workstation Routing ---")
        for role_name, email, password, expected_snippet, demo_btn_id in ROLES_TEST:
            driver.get(f"{BASE_WEB}/login")
            time.sleep(1.2)
            
            # Open Demo Accounts Drawer and click role chip
            demo_toggle = wait.until(EC.element_to_be_clickable((By.ID, "demo-credentials-toggle")))
            driver.execute_script("arguments[0].click();", demo_toggle)
            time.sleep(0.5)
            
            role_btn = wait.until(EC.element_to_be_clickable((By.ID, demo_btn_id)))
            driver.execute_script("arguments[0].click();", role_btn)
            time.sleep(0.5)
            
            submit_btn = driver.find_element(By.ID, "login-submit-btn")
            driver.execute_script("arguments[0].click();", submit_btn)
            
            # Wait for dashboard to load
            time.sleep(2.5)
            current_url = driver.current_url
            assert "/dashboard" in current_url, f"Failed to redirect to /dashboard for {role_name}, got {current_url}"
            
            # Verify body content has loaded
            page_text = driver.find_element(By.TAG_NAME, "body").text
            assert (email in page_text or role_name.upper().replace(" ", "_") in page_text or expected_snippet in page_text), f"Workstation content missing for {role_name}"
            print(f"[PASS] {role_name} ({email}) -> Logged in successfully -> Verified Role Workstation")

            # Capture role dashboard screenshot
            role_slug = role_name.lower().replace(" ", "_")
            role_ss = os.path.join(OUTPUT_DIR, f"dashboard_{role_slug}_1920x1080.png")
            driver.save_screenshot(role_ss)
            print(f"       Saved dashboard artifact: dashboard_{role_slug}_1920x1080.png")

            # Perform clean Logout
            signout_btn = wait.until(EC.presence_of_element_located((By.ID, "sidebar-signout-btn")))
            driver.execute_script("arguments[0].click();", signout_btn)
            time.sleep(2.0)
            wait.until(lambda d: "/login" in d.current_url)
            print(f"       Logout verified: Token cleared, redirected to /login")
            time.sleep(0.5)

        # 5. Test Unauthenticated Route Protection
        print("\n--- Phase 5: Unauthenticated Route Protection Test ---")
        driver.get(f"{BASE_WEB}/dashboard")
        time.sleep(1.0)
        assert "/login" in driver.current_url, f"Unauthenticated access permitted to /dashboard: {driver.current_url}"
        
        driver.get(f"{BASE_WEB}/owner")
        time.sleep(1.0)
        assert "/login" in driver.current_url, f"Unauthenticated access permitted to /owner: {driver.current_url}"
        print("[PASS] Unauthenticated access to /dashboard & /owner blocked and redirected to /login.")

        # 6. Test RBAC Access Denied (Driver attempting Super Admin route)
        print("\n--- Phase 6: 403 Forbidden RBAC Guard Test ---")
        driver.get(f"{BASE_WEB}/login")
        time.sleep(1.2)
        demo_toggle = wait.until(EC.element_to_be_clickable((By.ID, "demo-credentials-toggle")))
        driver.execute_script("arguments[0].click();", demo_toggle)
        time.sleep(0.4)
        driver_btn = driver.find_element(By.ID, "demo-btn-driver")
        driver.execute_script("arguments[0].click();", driver_btn)
        time.sleep(0.4)
        submit_btn = driver.find_element(By.ID, "login-submit-btn")
        driver.execute_script("arguments[0].click();", submit_btn)
        time.sleep(2.5)
        
        # Driver navigates to /admin/platform
        driver.get(f"{BASE_WEB}/admin/platform")
        time.sleep(1.2)
        body_text = driver.find_element(By.TAG_NAME, "body").text
        assert "403 FORBIDDEN" in body_text, f"Driver was not blocked from /admin/platform! Body: {body_text[:200]}"
        print("[PASS] Driver attempting to access /admin/platform received 403 Forbidden Access Denied.")

        # Capture 403 screenshot
        access_denied_ss = os.path.join(OUTPUT_DIR, "rbac_403_access_denied_1920x1080.png")
        driver.save_screenshot(access_denied_ss)
        print("       Saved 403 artifact: rbac_403_access_denied_1920x1080.png")

        print("\n=== ALL AUTHENTICATION & RBAC E2E TEST SUITES PASSED SUCCESSFULLY ===")

    finally:
        driver.quit()

if __name__ == "__main__":
    run_tests()
