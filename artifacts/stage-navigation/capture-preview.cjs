const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const destination = path.resolve(process.argv[2] || __dirname);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'erp-stage-review-'));
  const browser = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  ], { windowsHide: true, stdio: 'ignore' });
  let socket;
  try {
    const activePort = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(activePort); i++) await delay(100);
    const port = fs.readFileSync(activePort, 'utf8').split('\n')[0];
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
    let next = 0;
    const pending = new Map();
    socket.addEventListener('message', event => {
      const result = JSON.parse(event.data);
      if (!result.id) return;
      const task = pending.get(result.id);
      pending.delete(result.id);
      result.error ? task.reject(result.error) : task.resolve(result.result);
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++next;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
    await send('Page.enable');
    for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: pathToFileURL(path.join(destination, 'preview.html')).href });
      await delay(500);
      await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
      const metrics = await send('Runtime.evaluate', { expression: 'JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth,cards:document.querySelectorAll(".stage-step").length})', returnByValue: true });
      console.log(name, metrics.result.value);
      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(destination, `${name}.png`), Buffer.from(screenshot.data, 'base64'));
    }
    await send('Browser.close');
  } finally {
    socket?.close();
    browser.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
