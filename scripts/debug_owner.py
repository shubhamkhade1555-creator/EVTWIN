import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
driver = webdriver.Chrome(options=options)

try:
    driver.get("http://127.0.0.1:5173/login")
    time.sleep(1.0)
    email_inp = driver.find_element(By.ID, "login-email")
    pass_inp = driver.find_element(By.ID, "login-password")
    email_inp.send_keys(Keys.CONTROL + "a", Keys.BACKSPACE)
    email_inp.send_keys("owner@acmefleet.com")
    pass_inp.send_keys(Keys.CONTROL + "a", Keys.BACKSPACE)
    pass_inp.send_keys("Owner123!")
    pass_inp.send_keys(Keys.ENTER)
    time.sleep(2.5)
    print("Current URL:", driver.current_url)
    try:
        err = driver.find_element(By.ID, "login-error-alert").text
        print("Login Error Alert Text:", err)
    except Exception:
        print("No error alert found.")
    for entry in driver.get_log("browser"):
        print(f"[{entry['level']}] {entry['message']}")
finally:
    driver.quit()
