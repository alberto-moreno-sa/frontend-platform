import { loadConfig } from '@config';
import { logger } from '@common/logger';
import { createContainer } from './container';
import { createApp } from './app';

const log = logger.child({ component: 'Main' });

const bootstrap = async (): Promise<void> => {
  const config = loadConfig();

  log.info({ env: config.nodeEnv }, 'Starting tracking-service');

  const container = await createContainer(config);
  const app = createApp(config, container);

  const server = app.listen(config.port, () => {
    log.info({ port: config.port }, 'Tracking service running');
    log.debug({ brokerType: config.brokerType }, 'Broker type');
    log.debug({ swagger: `http://localhost:${config.port}/api/docs` }, 'Swagger UI available');
    log.debug({ health: `http://localhost:${config.port}/api/health` }, 'Health check available');
  });

  const shutdown = async (signal: string): Promise<void> => {
    log.info({ signal }, 'Shutting down gracefully');
    server.close(async () => {
      await container.close();
      log.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      log.warn('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

bootstrap().catch((error) => {
  log.error({ err: error }, 'Failed to start');
  process.exit(1);
});
