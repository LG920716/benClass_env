from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

driver = webdriver.Chrome()

driver.get("http://localhost:3000")

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//button[text()='登入']")))

login_button = driver.find_element(By.XPATH, "//button[text()='登入']")
login_button.click()

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, ":r0:")))

print("開始登入學生")
student_id = driver.find_element(By.ID, ":r0:")
student_id.send_keys("user_2")
password = driver.find_element(By.ID, ":r1:")
password.send_keys("222")

form = driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/div")
submit_button = form.find_element(By.XPATH, ".//button[text()='登入']")
WebDriverWait(driver, 20).until(EC.element_to_be_clickable(submit_button))

actions = ActionChains(driver)
actions.move_to_element(submit_button).click().perform()

if not submit_button.is_displayed():
    driver.execute_script("arguments[0].click();", submit_button)

try:
    print("學生頁面加載成功，網址:", driver.current_url)
except:
    print(f"登入失敗，當前頁面 URL: {driver.current_url}")
    raise

assert driver.current_url == "http://localhost:3000/", f"學生頁面加載失敗，當前頁面 URL: {driver.current_url}"
print("學生頁面加載成功，URL 正確:", driver.current_url)

time.sleep(5)
driver.refresh()

print("開始登入老師")
login_button = driver.find_element(By.XPATH, "//button[text()='登入']")
login_button.click()
teacher_id = driver.find_element(By.ID, ":r0:")
teacher_id.send_keys("teacher2")
teacher_password = driver.find_element(By.ID, ":r1:")
teacher_password.send_keys("teacher2")

form = driver.find_element(By.XPATH, "/html/body/div[2]/div[3]/div")
submit_button = form.find_element(By.XPATH, ".//button[text()='登入']")
WebDriverWait(driver, 20).until(EC.element_to_be_clickable(submit_button))

actions = ActionChains(driver)
actions.move_to_element(submit_button).click().perform()

if not submit_button.is_displayed():
    driver.execute_script("arguments[0].click();", submit_button)

try:
    WebDriverWait(driver, 20).until(EC.url_contains("courses"))
    print("老師頁面加載成功，網址:", driver.current_url)
except:
    print(f"登入失敗，當前頁面 URL: {driver.current_url}")
    raise

assert "courses" in driver.current_url, f"老師頁面加載失敗，當前頁面 URL: {driver.current_url}"
print("老師頁面加載成功，URL 正確:", driver.current_url)

driver.quit()
