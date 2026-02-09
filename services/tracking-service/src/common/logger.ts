import pino from 'pino';
import { loadConfig } from '@config';

const config = loadConfig();

export const logger = pino({
  level: config.logLevel,
  name: 'tracking-service',
});
