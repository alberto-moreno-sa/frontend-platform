import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';
import { Response } from 'express';

export interface SSEEmitterPort {
  addClient(res: Response): void;
  removeClient(res: Response): void;
  emit(event: TrackingEventEntity): void;
  getClientCount(): number;
}
