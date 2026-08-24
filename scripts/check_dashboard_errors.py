import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
driver = webdriver.Chrome(options=options)

try:
    driver.get("http://127.0.0.1:5173/login")
    time.sleep(1.0)
    driver.find_element(By.ID, "login-email").send_keys("superadmin@evtwin.io")
    pass_el = driver.find_element(By.ID, "login-password")
    pass_el.send_keys("SuperAdmin123!")
    pass_el.send_keys(Keys.ENTER)
    time.sleep(2.0)
    print("Browser Console Logs:")
    for entry in driver.get_log("browser"):
        print(f"[{entry['level']}] {entry['message']}")
finally:
    driver.quit()
