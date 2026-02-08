import { TrackingEventEntity } from '@tracking/domain/entities/tracking-event.entity';

export interface EventBrokerPort {
  connect(): Promise<void>;
  publish(topic: string, event: TrackingEventEntity): Promise<void>;
  subscribe(topic: string, handler: (event: TrackingEventEntity) => Promise<void>): Promise<void>;
  disconnect(): Promise<void>;
}
