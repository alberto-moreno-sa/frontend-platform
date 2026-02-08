export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Tracking Service API',
    description:
      'Component tracking analytics service. Tracks UI component interactions, persists events, and serves real-time stats via SSE + REST API.',
    version: '1.0.0',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    { name: 'Tracking', description: 'Component interaction tracking (ingesta)' },
    { name: 'Stats', description: 'Aggregated statistics and real-time SSE stream' },
    { name: 'Export', description: 'Data export (CSV/JSON, JWT auth required)' },
    { name: 'Health', description: 'Service health check' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http' as const,
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'ES256 JWT from auth-service (verified via JWKS)',
      },
    },
    schemas: {
      TrackingEvent: {
        type: 'object' as const,
        required: ['componentName', 'variant', 'action', 'timestamp', 'sessionId', 'pageUrl'],
        properties: {
          componentName: { type: 'string' as const, example: 'Button' },
          variant: { type: 'string' as const, example: 'primary' },
          action: {
            type: 'string' as const,
            enum: ['click', 'hover', 'focus', 'blur', 'submit', 'view', 'scroll', 'change'],
            example: 'click',
          },
          timestamp: { type: 'string' as const, format: 'date-time' },
          sessionId: { type: 'string' as const, format: 'uuid' },
          pageUrl: { type: 'string' as const, example: '/checkout' },
          pageTitle: { type: 'string' as const, nullable: true },
          referrer: { type: 'string' as const, nullable: true },
          viewport: {
            type: 'object' as const,
            properties: {
              width: { type: 'integer' as const },
              height: { type: 'integer' as const },
            },
          },
          userAgent: { type: 'string' as const, nullable: true },
          language: { type: 'string' as const, nullable: true },
          metadata: { type: 'object' as const },
        },
      },
      Error: {
        type: 'object' as const,
        properties: {
          error: {
            type: 'object' as const,
            properties: {
              code: { type: 'string' as const },
              message: { type: 'string' as const },
            },
          },
          timestamp: { type: 'string' as const, format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/components/track': {
      post: {
        tags: ['Tracking'],
        summary: 'Track a component interaction',
        description: 'Accepts a tracking event, validates it, publishes to broker, returns 202.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TrackingEvent' },
            },
          },
        },
        responses: {
          '202': {
            description: 'Event accepted for processing',
            content: {
              'application/json': {
                schema: {
                  type: 'object' as const,
                  properties: {
                    status: { type: 'string' as const, example: 'accepted' },
                    eventId: { type: 'string' as const },
                    timestamp: { type: 'string' as const, format: 'date-time' },
                  },
                },
              },
            },
          },
          '400': { description: 'Validation error' },
          '503': { description: 'Broker unavailable' },
        },
      },
    },
    '/api/components/stats': {
      get: {
        tags: ['Stats'],
        summary: 'Get aggregated statistics',
        parameters: [
          { name: 'from', in: 'query' as const, schema: { type: 'string' as const, format: 'date-time' } },
          { name: 'to', in: 'query' as const, schema: { type: 'string' as const, format: 'date-time' } },
          { name: 'component', in: 'query' as const, schema: { type: 'string' as const } },
          { name: 'page', in: 'query' as const, schema: { type: 'string' as const } },
        ],
        responses: {
          '200': { description: 'Aggregated stats snapshot' },
          '500': { description: 'Stats computation error' },
        },
      },
    },
    '/api/components/stats/stream': {
      get: {
        tags: ['Stats'],
        summary: 'SSE stream for real-time stats',
        description: 'Sends initial stats snapshot, then emits each new interaction as SSE event.',
        responses: {
          '200': { description: 'text/event-stream' },
        },
      },
    },
    '/api/components/export': {
      get: {
        tags: ['Export'],
        summary: 'Export tracking data (JWT auth required)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'format', in: 'query' as const, schema: { type: 'string' as const, enum: ['csv', 'json'], default: 'json' } },
          { name: 'from', in: 'query' as const, schema: { type: 'string' as const, format: 'date-time' } },
          { name: 'to', in: 'query' as const, schema: { type: 'string' as const, format: 'date-time' } },
          { name: 'component', in: 'query' as const, schema: { type: 'string' as const } },
          { name: 'page', in: 'query' as const, schema: { type: 'string' as const } },
        ],
        responses: {
          '200': { description: 'Exported data (CSV or JSON)' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Export error' },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Service health check',
        responses: {
          '200': { description: 'Service healthy' },
          '503': { description: 'Service unhealthy' },
        },
      },
    },
  },
};
