import { Response } from 'express';
import { TrackingRepositoryPort } from '../ports/tracking-repository.port';
import { SSEEmitterPort } from '../ports/sse-emitter.port';
import { logger } from '@common/logger';

const log = logger.child({ component: 'StreamStats' });

interface StreamStatsDeps {
  readonly trackingRepo: TrackingRepositoryPort;
  readonly sseEmitter: SSEEmitterPort;
}

/**
 * Establishes an SSE connection for real-time stats streaming.
 * Sets SSE headers and flushes them immediately → sends an initial aggregated
 * stats snapshot → registers the client for live updates via the SSE emitter →
 * auto-unregisters on client disconnect.
 */
export const createStreamStatsUseCase = (deps: StreamStatsDeps) => {
  return async (res: Response): Promise<void> => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    log.debug('SSE client connecting');

    // Send initial stats snapshot
    try {
      const stats = await deps.trackingRepo.getAggregatedStats({});
      res.write(`data: ${JSON.stringify(stats)}\n\n`);
      log.debug('Initial snapshot sent');
    } catch (error) {
      log.error({ err: error }, 'Failed to send initial snapshot');
    }

    // Register client for real-time updates
    deps.sseEmitter.addClient(res);
    log.info({ clients: deps.sseEmitter.getClientCount() }, 'SSE client registered');

    // Cleanup on disconnect
    res.on('close', () => {
      deps.sseEmitter.removeClient(res);
      log.info({ clients: deps.sseEmitter.getClientCount() }, 'SSE client disconnected');
    });
  };
};
