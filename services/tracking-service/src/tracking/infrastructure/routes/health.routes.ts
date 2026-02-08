import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { SSEEmitterPort } from '@tracking/application/ports/sse-emitter.port';

interface HealthRoutesDeps {
  readonly sseEmitter: SSEEmitterPort;
  readonly brokerType: string;
}

export const createHealthRoutes = (deps: HealthRoutesDeps): Router => {
  const router = Router();
  const startTime = Date.now();

  router.get('/', (_req: Request, res: Response) => {
    const mongoState = mongoose.connection.readyState;
    const isMongoConnected = mongoState === 1;

    const status = isMongoConnected ? 'healthy' : 'unhealthy';
    const statusCode = isMongoConnected ? 200 : 503;

    res.status(statusCode).json({
      status,
      service: 'tracking',
      uptime: Math.floor((Date.now() - startTime) / 1000),
      mongodb: isMongoConnected ? 'connected' : 'disconnected',
      broker: {
        type: deps.brokerType,
        connected: true,
      },
      sseClients: deps.sseEmitter.getClientCount(),
      timestamp: new Date().toISOString(),
    });
  });

  return router;
};
