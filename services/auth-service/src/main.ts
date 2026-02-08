import { loadConfig } from '@config';
import { createContainer } from './container';
import { createApp } from './app';

const bootstrap = async (): Promise<void> => {
  const config = loadConfig();

  console.log(`[Main] Starting auth-service in ${config.nodeEnv} mode...`);

  const container = await createContainer(config);
  const app = createApp(config, container);

  const server = app.listen(config.port, () => {
    console.log(`[Main] Auth service running on port ${config.port}`);
    console.log(`[Main] Swagger UI: http://localhost:${config.port}/api/docs`);
    console.log(`[Main] Health check: http://localhost:${config.port}/health`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[Main] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await container.close();
      console.log('[Main] Server closed.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('[Main] Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

bootstrap().catch((error) => {
  console.error('[Main] Failed to start:', error);
  process.exit(1);
});
