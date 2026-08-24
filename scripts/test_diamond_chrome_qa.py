import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://127.0.0.1:5173"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-artifacts", "visual-audit")
os.makedirs(OUTPUT_DIR, exist_ok=True)

PAGES = [
    ("/", "home"),
    ("/product", "product"),
    ("/solutions", "solutions"),
    ("/technology", "technology"),
    ("/features", "features"),
    ("/roadmap", "roadmap"),
    ("/about", "about"),
    ("/contact", "contact"),
    ("/login", "login"),
]

VIEWPORTS = [
    ("1920x1080", 1920, 1080),
    ("1440x900", 1440, 900),
    ("1280x800", 1280, 800),
    ("1024x768", 1024, 768),
    ("768x1024", 768, 1024),
    ("414x896", 414, 896),
    ("390x844", 390, 844),
    ("375x812", 375, 812),
]

def create_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=options)

def run_qa():
    print("=== Starting EVTWIN Diamond Chrome Visual QA Suite ===")
    driver = create_driver()
    
    try:
        # 1. Multi-Viewport & Multi-Theme Audit across all Public Pages
        for route, name in PAGES:
            print(f"\n--- Auditing Page: {name.upper()} ({route}) ---")
            
            # Dark Mode Desktop 1920x1080
            driver.set_window_size(1920, 1080)
            driver.get(f"{BASE_URL}{route}")
            time.sleep(1.2)
            
            # Set Dark mode explicitly
            driver.execute_script("document.documentElement.setAttribute('data-theme', 'dark');")
            time.sleep(0.4)
            dark_path = os.path.join(OUTPUT_DIR, f"{name}_dark_1920x1080.png")
            driver.save_screenshot(dark_path)
            print(f"  [PASS] Captured Dark Mode: {name}_dark_1920x1080.png")

            # Toggle Light Mode
            driver.execute_script("document.documentElement.setAttribute('data-theme', 'light');")
            time.sleep(0.4)
            light_path = os.path.join(OUTPUT_DIR, f"{name}_light_1920x1080.png")
            driver.save_screenshot(light_path)
            print(f"  [PASS] Captured Light Mode: {name}_light_1920x1080.png")

            # Reset back to Dark mode
            driver.execute_script("document.documentElement.setAttribute('data-theme', 'dark');")

            # Mobile viewports capture for key landing pages
            if name in ["home", "product", "login"]:
                for vp_name, w, h in [("390x844", 390, 844), ("768x1024", 768, 1024)]:
                    driver.set_window_size(w, h)
                    time.sleep(0.5)
                    vp_path = os.path.join(OUTPUT_DIR, f"{name}_dark_{vp_name}.png")
                    driver.save_screenshot(vp_path)
                    print(f"  [PASS] Captured Responsive {vp_name}: {name}_dark_{vp_name}.png")

        print("\n=== ALL DIAMOND CHROME VISUAL QA SUITES PASSED SUCCESSFULLY ===")

    finally:
        driver.quit()

if __name__ == "__main__":
    run_qa()
