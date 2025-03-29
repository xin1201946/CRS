// 从 log.js 文件中导入 add_log 函数
// Import the add_log function from the log.js file
import {add_log} from "./log.js";

/**
 * 检查浏览器的名称和版本。
 * Checks the browser name and version.
 * @returns {string} 包含浏览器名称和版本的字符串。
 * @returns {string} A string containing the browser name and version.
 */
export function check_browser() {
  // 记录开始检查浏览器版本
  // Log the start of the browser version check
  add_log('Try_Check_Browser_Version','successfully')
  // 检查代码是否在浏览器环境中运行
  // Check if the code is running in a browser environment
  if (typeof window !== 'undefined') {
      // 获取用户代理字符串并转换为小写
      // Get the user agent string and convert it to lowercase
      const ua = navigator.userAgent.toLowerCase()
      // 初始化浏览器名称为 'Unknown'
      // Initialize the browser name as 'Unknown'
      let browserName = 'Unknown'
      // 初始化浏览器版本为空字符串
      // Initialize the browser version as an empty string
      let browserVersion = ''

      // 定义一个包含浏览器对象的数组，每个对象包含名称和正则表达式模式
      // Define an array of browser objects with name and regex patterns
      const browsers = [
        { name: 'edge', regex: /edg(?:e|a|ios)\/(\d+(\.\d+)?)/},
        { name: 'chrome', regex: /(?!chromeframe)(?:chrome|crios)\/(\d+(\.\d+)?)/},
        { name: 'firefox', regex: /firefox\/(\d+(\.\d+)?)/},
        { name: 'safari', regex: /version\/(\d+(\.\d+)?).+?safari/},
        { name: 'opera', regex: /(?:opera|opr)\/(\d+(\.\d+)?)/}
      ]

      // 遍历 browsers 数组，查找匹配项
      // Iterate through the browsers array to find a match
      for (const browser of browsers) {
        // 尝试将用户代理字符串与浏览器的正则表达式模式进行匹配
        // Try to match the user agent string with the browser's regex pattern
        const match = ua.match(browser.regex)
        if (match) {
          // 如果找到匹配项，则设置浏览器名称
          // Set the browser name if a match is found
          browserName = browser.name
          // 如果找到匹配项，则设置浏览器版本
          // Set the browser version if a match is found
          browserVersion = match[1]
          // 记录成功检查浏览器版本
          // Log the successful browser version check
          add_log('Check_Browser_Version','successfully',browserName+' == '+browserVersion)
          // 如果找到匹配项，则跳出循环
          // Break the loop if a match is found
          break
        }
      }

      // 返回格式化后的浏览器名称和版本
      // Return the formatted browser name and version
      return `${browserName.charAt(0).toUpperCase() + browserName.slice(1)}: ${browserVersion}`
  }
}
