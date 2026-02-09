import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly mongoUri: string;
  readonly brokerType: 'kafka' | 'memory';
  readonly kafkaBrokers: string[];
  readonly kafkaTopic: string;
  readonly kafkaClientId: string;
  readonly kafkaGroupId: string;
  readonly authServiceUrl: string;
  readonly allowedOrigins: string[];
  readonly logLevel: string;
}

export const loadConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/component_tracking',
  brokerType: (process.env.BROKER_TYPE || 'memory') as 'kafka' | 'memory',
  kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  kafkaTopic: process.env.KAFKA_TOPIC || 'component.tracking',
  kafkaClientId: process.env.KAFKA_CLIENT_ID || 'tracking-service',
  kafkaGroupId: process.env.KAFKA_GROUP_ID || 'tracking-consumer-group',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  logLevel: process.env.LOG_LEVEL || 'info',
});
