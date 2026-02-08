import { Response } from 'express';
import { TrackingRepositoryPort } from '../ports/tracking-repository.port';
import { SSEEmitterPort } from '../ports/sse-emitter.port';

interface StreamStatsDeps {
  readonly trackingRepo: TrackingRepositoryPort;
  readonly sseEmitter: SSEEmitterPort;
}

export const createStreamStatsUseCase = (deps: StreamStatsDeps) => {
  return async (res: Response): Promise<void> => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send initial stats snapshot
    try {
      const stats = await deps.trackingRepo.getAggregatedStats({});
      res.write(`data: ${JSON.stringify(stats)}\n\n`);
    } catch (error) {
      console.error('[StreamStats] Failed to send initial snapshot:', error);
    }

    // Register client for real-time updates
    deps.sseEmitter.addClient(res);

    // Cleanup on disconnect
    res.on('close', () => {
      deps.sseEmitter.removeClient(res);
    });
  };
};
