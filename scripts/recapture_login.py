import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-artifacts", "visual-audit")
os.makedirs(OUTPUT_DIR, exist_ok=True)

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(options=options)
try:
    driver.get("http://127.0.0.1:5173/login")
    time.sleep(2.0)
    filepath = os.path.join(OUTPUT_DIR, "login_1920x1080.png")
    driver.save_screenshot(filepath)
    print("Recaptured login screenshot:", filepath)
finally:
    driver.quit()
