import { Response } from 'express';
import { SSEEmitterPort } from '@tracking/application/ports/sse-emitter.port';
import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { logger } from '@common/logger';

const log = logger.child({ component: 'SSEEmitter' });

/**
 * SSE emitter that manages connected clients via a Set of Response objects.
 * On emit, broadcasts to all clients; if a write fails (client disconnected),
 * the client is auto-removed from the set.
 */
export const createNodeSSEEmitterAdapter = (): SSEEmitterPort => {
  const clients = new Set<Response>();

  return {
    addClient: (res: Response): void => {
      clients.add(res);
    },

    removeClient: (res: Response): void => {
      clients.delete(res);
    },

    emit: (event: TrackingEventEntity): void => {
      const data = JSON.stringify({
        componentName: event.componentName,
        variant: event.variant,
        action: event.action,
        pageUrl: event.pageUrl,
        timestamp: event.timestamp instanceof Date ? event.timestamp.toISOString() : event.timestamp,
      });

      for (const client of clients) {
        try {
          client.write(`event: interaction\ndata: ${data}\n\n`);
        } catch {
          clients.delete(client);
          log.debug({ clients: clients.size }, 'Stale SSE client removed');
        }
      }
      log.debug({ clients: clients.size, componentName: event.componentName }, 'Event broadcast');
    },

    getClientCount: (): number => clients.size,
  };
};
