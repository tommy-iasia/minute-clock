'use strict';

const { spawn } = require('node:child_process');
const path = require('node:path');

const SCHEDULE_PATH = path.join(__dirname, 'minute-clock.json');
const MINUTE_MS = 60_000;

function timestamp() {
  return new Date().toLocaleString('lt-LT');
}

function loadSchedule() {
  const contents = require('node:fs').readFileSync(SCHEDULE_PATH, 'utf8');
  const schedule = JSON.parse(contents);

  if (!Array.isArray(schedule)) {
    throw new TypeError('minute-clock.json must contain an array of scheduled items.');
  }

  for (const [index, item] of schedule.entries()) {
    if (
      !item ||
      !Array.isArray(item.times) ||
      !item.times.every((time) => typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time)) ||
      typeof item.title !== 'string' ||
      typeof item.command !== 'string' ||
      !Array.isArray(item.arguments) ||
      !item.arguments.every((argument) => typeof argument === 'string') ||
      typeof item.path !== 'string'
    ) {
      throw new TypeError(`Scheduled item ${index} must have valid times, title, command, arguments, and path fields.`);
    }
  }

  return schedule;
}

function launchItem(item) {
  const child = spawn(item.command, item.arguments, {
    cwd: item.path,
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  child.on('error', (error) => {
    console.error(`[${timestamp()}] Could not launch "${item.title}":`, error.message);
  });
}

function runMinute(now = new Date(), launch = launchItem) {
  const minute = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const schedule = loadSchedule();

  for (const item of schedule) {
    if (item.times.includes(minute)) {
      console.log(`[${timestamp()}] [${minute}] Triggering "${item.title}".`);
      launch(item);
    }
  }
}

function sleepUntilNextMinute() {
  const delay = MINUTE_MS - (Date.now() % MINUTE_MS);
  console.log(`[${timestamp()}] Sleeping for ${Math.ceil(delay / 1000)} seconds until the next minute.`);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function main() {
  while (true) {
    try {
      runMinute();
    } catch (error) {
      console.error(`[${timestamp()}] Could not read or process minute-clock.json:`, error.message);
    }

    await sleepUntilNextMinute();
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadSchedule, runMinute, sleepUntilNextMinute };
