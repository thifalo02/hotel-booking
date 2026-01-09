#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function log(msg) { console.log(`[setup] ${msg}`); }
function run(cmd) { log(`$ ${cmd}`); execSync(cmd, { stdio: 'inherit' }); }

function getPlaywrightCacheDir() {
  const platform = process.platform;
  if (platform === 'darwin') return path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  if (platform === 'linux') return path.join(os.homedir(), '.cache', 'ms-playwright');
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  return path.join(localAppData, 'ms-playwright');
}

function hasChromiumInstalled(cacheDir) {
  try {
    const entries = fs.readdirSync(cacheDir, { withFileTypes: true });
    return entries.some(e => e.isDirectory() && /chromium/i.test(e.name));
  } catch {
    return false;
  }
}

(function main() {
  log('Installing npm dependencies…');
  run('npm install');

  const cacheDir = getPlaywrightCacheDir();
  const hasBrowsers = hasChromiumInstalled(cacheDir);
  if (hasBrowsers) {
    log(`Playwright browsers found in: ${cacheDir}`);
  } else {
    log('Playwright browsers not found; installing…');
    run('npx playwright install');
  }

  log('Setup completed. You can now run tests:');
  log('npx playwright test');
})();
