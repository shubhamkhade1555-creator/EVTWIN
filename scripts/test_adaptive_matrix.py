import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

BASE_URL = "http://127.0.0.1:5173"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-artifacts", "adaptive-matrix")
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = [
    ("xs_mobile_320x800", 320, 800),
    ("small_mobile_360x800", 360, 800),
    ("small_mobile_375x812", 375, 812),
    ("std_mobile_390x844", 390, 844),
    ("std_mobile_414x896", 414, 896),
    ("large_mobile_480x900", 480, 900),
    ("mobile_landscape_844x390", 844, 390),
    ("tablet_portrait_768x1024", 768, 1024),
    ("tablet_portrait_820x1180", 820, 1180),
    ("tablet_landscape_1024x768", 1024, 768),
    ("small_desktop_1200x800", 1200, 800),
    ("small_desktop_1366x768", 1366, 768),
    ("std_desktop_1440x900", 1440, 900),
    ("std_desktop_1536x864", 1536, 864),
    ("large_desktop_1920x1080", 1920, 1080),
    ("ultra_desktop_2560x1440", 2560, 1440),
]

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

def create_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=options)

def run_adaptive_matrix():
    print("=== Starting EVTWIN Adaptive Multi-Viewport Matrix QA ===")
    driver = create_driver()

    try:
        total_tests = 0
        overflow_defects = 0

        # 1. Test Home page across all 16 viewports in Dark and Light modes
        print("\n--- Phase 1: Adaptive Viewport Matrix for Flagship Home Page ---")
        for vp_name, w, h in VIEWPORTS:
            driver.set_window_size(w, h)
            driver.get(f"{BASE_URL}/")
            time.sleep(0.6)

            # Check for horizontal overflow defect
            scroll_width = driver.execute_script("return document.documentElement.scrollWidth;")
            inner_width = driver.execute_script("return window.innerWidth;")
            if scroll_width > inner_width:
                print(f"  [DEFECT] Horizontal overflow detected at {vp_name}: scrollWidth ({scroll_width}) > innerWidth ({inner_width})")
                overflow_defects += 1
            else:
                print(f"  [PASS] Zero horizontal overflow at {vp_name} (width: {inner_width}px)")

            # Save Dark Mode Screenshot
            driver.execute_script("document.documentElement.setAttribute('data-theme', 'dark');")
            time.sleep(0.2)
            dark_file = os.path.join(OUTPUT_DIR, f"home_dark_{vp_name}.png")
            driver.save_screenshot(dark_file)

            # Save Light Mode Screenshot
            driver.execute_script("document.documentElement.setAttribute('data-theme', 'light');")
            time.sleep(0.2)
            light_file = os.path.join(OUTPUT_DIR, f"home_light_{vp_name}.png")
            driver.save_screenshot(light_file)
            total_tests += 2

        # 2. Test Key Pages (Product, Technology, Login) on core representative viewports
        print("\n--- Phase 2: Core Representative Viewports for Application Pages ---")
        core_viewports = [
            ("mobile_390x844", 390, 844),
            ("tablet_768x1024", 768, 1024),
            ("desktop_1440x900", 1440, 900),
            ("desktop_1920x1080", 1920, 1080)
        ]

        for route, name in PAGES:
            if name == "home":
                continue
            for vp_name, w, h in core_viewports:
                driver.set_window_size(w, h)
                driver.get(f"{BASE_URL}{route}")
                time.sleep(0.5)

                # Check horizontal overflow
                scroll_w = driver.execute_script("return document.documentElement.scrollWidth;")
                inner_w = driver.execute_script("return window.innerWidth;")
                if scroll_w > inner_w:
                    print(f"  [DEFECT] Overflow on {name} at {vp_name}: {scroll_w} > {inner_w}")
                    overflow_defects += 1

                file_path = os.path.join(OUTPUT_DIR, f"{name}_dark_{vp_name}.png")
                driver.save_screenshot(file_path)
                total_tests += 1

        print(f"\n=== ADAPTIVE QA COMPLETE: {total_tests} Screenshots Captured | {overflow_defects} Horizontal Overflow Defects ===")

    finally:
        driver.quit()

if __name__ == "__main__":
    run_adaptive_matrix()
