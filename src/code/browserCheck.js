import {add_log} from "./log.js";

export function check_browser() {
  add_log('Try_Check_Browser_Version','successfully')
  if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase()
        let browserName = 'Unknown'
        let browserVersion = ''

        const browsers = [
          { name: 'edge', regex: /edg(?:e|a|ios)\/(\d+(\.\d+)?)/},
          { name: 'chrome', regex: /(?!chromeframe)(?:chrome|crios)\/(\d+(\.\d+)?)/},
          { name: 'firefox', regex: /firefox\/(\d+(\.\d+)?)/},
          { name: 'safari', regex: /version\/(\d+(\.\d+)?).+?safari/},
          { name: 'opera', regex: /(?:opera|opr)\/(\d+(\.\d+)?)/}
        ]

        for (const browser of browsers) {
          const match = ua.match(browser.regex)
          if (match) {
            browserName = browser.name
            browserVersion = match[1]
            add_log('Check_Browser_Version','successfully',browserName+' == '+browserVersion)
            break
          }
        }

        return `${browserName.charAt(0).toUpperCase() + browserName.slice(1)}: ${browserVersion}`
  }
}