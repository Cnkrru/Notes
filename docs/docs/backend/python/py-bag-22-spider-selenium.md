---
title: "Python selenium包"
description: "Python selenium包常用函数参考，包括浏览器操作、元素定位、页面交互等功能。"
date: 2026-04-21
tags: [Python, selenium, 爬虫, 浏览器自动化]
sidebar: auto
---

# Python selenium包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `webdriver.Chrome([executable_path, options])` | 无 | 创建Chrome浏览器驱动 |
| `webdriver.Firefox([executable_path, options])` | 无 | 创建Firefox浏览器驱动 |
| `webdriver.Edge([executable_path, options])` | 无 | 创建Edge浏览器驱动 |
| `driver.get(url)` | url: 网页地址 | 打开指定URL |
| `driver.find_element(by, value)` | by: 定位方式, value: 定位值 | 查找单个元素 |
| `driver.find_elements(by, value)` | by: 定位方式, value: 定位值 | 查找多个元素 |
| `driver.find_element_by_id(id_)` | id_: 元素ID | 通过ID查找元素 |
| `driver.find_element_by_name(name)` | name: 元素name属性 | 通过name查找元素 |
| `driver.find_element_by_xpath(xpath)` | xpath: XPath表达式 | 通过XPath查找元素 |
| `driver.find_element_by_css_selector(css_selector)` | css_selector: CSS选择器 | 通过CSS选择器查找元素 |
| `element.click()` | 无 | 点击元素 |
| `element.send_keys(*value)` | value: 输入内容 | 向元素发送键盘输入 |
| `element.clear()` | 无 | 清除元素内容 |
| `element.text` | 无 | 获取元素文本 |
| `element.get_attribute(name)` | name: 属性名 | 获取元素属性 |
| `element.is_displayed()` | 无 | 检查元素是否可见 |
| `element.is_enabled()` | 无 | 检查元素是否可用 |
| `element.is_selected()` | 无 | 检查元素是否被选中 |
| `driver.current_url` | 无 | 获取当前URL |
| `driver.title` | 无 | 获取当前页面标题 |
| `driver.page_source` | 无 | 获取当前页面源码 |
| `driver.back()` | 无 | 浏览器后退 |
| `driver.forward()` | 无 | 浏览器前进 |
| `driver.refresh()` | 无 | 刷新页面 |
| `driver.quit()` | 无 | 关闭浏览器 |
| `driver.close()` | 无 | 关闭当前窗口 |
| `driver.switch_to.window(window_name)` | window_name: 窗口句柄 | 切换到指定窗口 |
| `driver.switch_to.frame(frame_reference)` | frame_reference:  frame引用 | 切换到指定iframe |
| `driver.implicitly_wait(time_to_wait)` | time_to_wait: 等待时间(秒) | 设置隐式等待时间 |
| `WebDriverWait(driver, timeout).until(method[, message])` | driver: 驱动对象, timeout: 超时时间 | 显式等待 |
| `expected_conditions.presence_of_element_located(locator)` | locator: 元素定位器 | 检查元素是否存在 |
| `expected_conditions.visibility_of_element_located(locator)` | locator: 元素定位器 | 检查元素是否可见 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `executable_path` | str | 浏览器驱动路径 |
| `options` | Options | 浏览器选项 |
| `url` | str | 要访问的网页地址 |
| `by` | By | 元素定位方式，如By.ID, By.NAME等 |
| `value` | str | 定位值 |
| `timeout` | int | 超时时间(秒) |
| `locator` | tuple | 元素定位器，如(By.ID, 'element_id') |

### 元素定位方式
| 定位方式 | 说明 | 示例 |
|---------|------|------|
| `By.ID` | 通过元素ID定位 | `driver.find_element(By.ID, 'username')` |
| `By.NAME` | 通过元素name属性定位 | `driver.find_element(By.NAME, 'password')` |
| `By.CLASS_NAME` | 通过元素class属性定位 | `driver.find_element(By.CLASS_NAME, 'btn')` |
| `By.TAG_NAME` | 通过元素标签名定位 | `driver.find_element(By.TAG_NAME, 'input')` |
| `By.LINK_TEXT` | 通过链接文本定位 | `driver.find_element(By.LINK_TEXT, '登录')` |
| `By.PARTIAL_LINK_TEXT` | 通过部分链接文本定位 | `driver.find_element(By.PARTIAL_LINK_TEXT, '登')` |
| `By.XPATH` | 通过XPath表达式定位 | `driver.find_element(By.XPATH, '//input[@id="username"]')` |
| `By.CSS_SELECTOR` | 通过CSS选择器定位 | `driver.find_element(By.CSS_SELECTOR, '#username')` |

### 浏览器选项参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `--headless` | str | 无头模式，不显示浏览器窗口 |
| `--disable-gpu` | str | 禁用GPU加速 |
| `--window-size` | str | 设置浏览器窗口大小 |
| `--user-agent` | str | 设置用户代理 |
| `--proxy-server` | str | 设置代理服务器 |