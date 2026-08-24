import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-artifacts", "visual-audit")
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = [
    ("home_1920x1080", 1920, 1080),
    ("home_1440x900", 1440, 900),
    ("home_1280x800", 1280, 800),
    ("home_1024x768", 1024, 768),
    ("home_768x1024", 768, 1024),
    ("home_414x896", 414, 896),
    ("home_390x844", 390, 844),
    ("home_375x812", 375, 812),
]

def main():
    options = ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(options=options)
    try:
        for vp_name, width, height in VIEWPORTS:
            driver.set_window_size(width, height)
            driver.get("http://127.0.0.1:5173/")
            time.sleep(2.5)  # Wait for images and live physics engine
            filepath = os.path.join(OUTPUT_DIR, f"{vp_name}.png")
            driver.save_screenshot(filepath)
            print(f"Captured: {vp_name}.png ({os.path.getsize(filepath)} bytes)")
        print("Home viewports capture complete.")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
