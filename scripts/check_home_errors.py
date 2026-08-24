from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless=new")
options.set_capability("goog:loggingPrefs", {"browser": "ALL"})

driver = webdriver.Chrome(options=options)
try:
    driver.get("http://127.0.0.1:5173/")
    logs = driver.get_log("browser")
    print("Browser logs for Home page:")
    for entry in logs:
        print(entry)
finally:
    driver.quit()
