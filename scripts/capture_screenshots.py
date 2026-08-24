import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-artifacts", "visual-audit")
os.makedirs(OUTPUT_DIR, exist_ok=True)

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

PAGES = [
    ("home", "http://127.0.0.1:5173/"),
    ("technology", "http://127.0.0.1:5173/technology"),
    ("product", "http://127.0.0.1:5173/product"),
    ("solutions", "http://127.0.0.1:5173/solutions"),
    ("features", "http://127.0.0.1:5173/features"),
    ("roadmap", "http://127.0.0.1:5173/roadmap"),
    ("about", "http://127.0.0.1:5173/about"),
    ("contact", "http://127.0.0.1:5173/contact"),
    ("login", "http://127.0.0.1:5173/login"),
]

def main():
    options = ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    try:
        # Capture all public pages at 1920x1080
        for page_name, url in PAGES:
            driver.set_window_size(1920, 1080)
            driver.get(url)
            time.sleep(2.0)  # Wait for CSS/fonts/images
            filepath = os.path.join(OUTPUT_DIR, f"{page_name}_1920x1080.png")
            driver.save_screenshot(filepath)
            print(f"Captured: {page_name}_1920x1080.png ({os.path.getsize(filepath)} bytes)")

        # Capture Home across all responsive viewports
        for vp_name, width, height in VIEWPORTS:
            if vp_name == "1920x1080":
                continue
            driver.set_window_size(width, height)
            driver.get("http://127.0.0.1:5173/")
            time.sleep(1.5)
            filepath = os.path.join(OUTPUT_DIR, f"home_{vp_name}.png")
            driver.save_screenshot(filepath)
            print(f"Captured: home_{vp_name}.png ({os.path.getsize(filepath)} bytes)")

        print("Visual audit screenshot capture complete.")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
