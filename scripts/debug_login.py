import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")
driver = webdriver.Chrome(options=options)

try:
    driver.get("http://127.0.0.1:5173/login")
    time.sleep(1.0)
    driver.find_element(By.ID, "login-email").send_keys("superadmin@evtwin.io")
    pass_el = driver.find_element(By.ID, "login-password")
    pass_el.send_keys("SuperAdmin123!")
    pass_el.send_keys(Keys.ENTER)
    time.sleep(2.5)
    driver.save_screenshot("test-artifacts/visual-audit/debug_superadmin.png")
    print("Screenshot saved to test-artifacts/visual-audit/debug_superadmin.png")
    print("Current URL:", driver.current_url)
finally:
    driver.quit()
