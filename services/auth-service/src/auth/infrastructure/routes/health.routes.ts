import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Redis from 'ioredis';

export interface HealthRoutesDeps {
  readonly redis: Redis;
}

export const createHealthRoutes = (deps: HealthRoutesDeps): Router => {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    const checks: Record<string, any> = {};
    let allHealthy = true;

    // MongoDB check
    try {
      const start = Date.now();
      await mongoose.connection.db!.admin().ping();
      checks.mongodb = { status: 'healthy', latency_ms: Date.now() - start, connected: true };
    } catch {
      checks.mongodb = { status: 'unhealthy', latency_ms: 0, connected: false };
      allHealthy = false;
    }

    // Redis check
    try {
      const start = Date.now();
      await deps.redis.ping();
      checks.redis = { status: 'healthy', latency_ms: Date.now() - start, connected: true };
    } catch {
      checks.redis = { status: 'unhealthy', latency_ms: 0, connected: false };
      allHealthy = false;
    }

    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      checks,
    });
  });

  return router;
};
