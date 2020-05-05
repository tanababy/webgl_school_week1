export default function BrowserCheck(): void {
  const ua: string = navigator.userAgent.toLowerCase();
  const ver: string = navigator.appVersion.toLowerCase();
  let device = '';
  let browser = '';
  if (ua.includes('iphone')) {
    device = 'iphone';
  } else if (ua.includes('ipad')) {
    device = 'ipad';
  } else if (ua.includes('android')) {
    device = 'android';
  } else if (ua.includes('win')) {
    device = 'windows';
  } else if (ua.includes('mac')) {
    device = 'mac';
  } else {
    device = 'unknown';
  }
  if (ua.includes('msie')) {
    if (ver.includes('msie 9.')) {
      browser = 'ie9';
    } else if (ver.includes('msie 10.')) {
      browser = 'ie10';
    } else {
      browser = 'ie';
    }
  } else if (ua.includes('trident/7')) {
    browser = 'ie11';
  } else if (ua.includes('edge')) {
    browser = 'edge';
  } else if (ua.includes('chrome')) {
    browser = 'chrome';
  } else if (ua.includes('safari')) {
    browser = 'safari';
  } else if (ua.includes('firefox')) {
    browser = 'firefox';
  } else {
    browser = 'unknown';
  }
  const cls: [string, string] = [browser, device];
  document.body.classList.add(...cls);
}
