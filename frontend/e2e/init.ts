// frontend/e2e/init.ts
import { device, init as detoxInit, cleanup } from 'detox';

const config = require('../.detoxrc.js');

beforeAll(async () => {
  await detoxInit(config);
  await device.launchApp();
}, 300000);

afterAll(async () => {
  await cleanup();
});
