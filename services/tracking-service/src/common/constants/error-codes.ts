export const ErrorCodes = {
  // Validation (400)
  INVALID_TRACKING_DATA: {
    code: 'INVALID_TRACKING_DATA',
    status: 400,
    message: 'Invalid tracking data',
  },
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    status: 400,
    message: 'Request validation failed',
  },

  // Authentication (401)
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: 'Missing or invalid Authorization header',
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    status: 401,
    message: 'Token has expired',
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    status: 401,
    message: 'Invalid token',
  },

  // Server Errors (500)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  STATS_ERROR: {
    code: 'STATS_ERROR',
    status: 500,
    message: 'Failed to compute statistics',
  },
  EXPORT_ERROR: {
    code: 'EXPORT_ERROR',
    status: 500,
    message: 'Failed to export data',
  },

  // Service Unavailable (503)
  BROKER_PUBLISH_ERROR: {
    code: 'BROKER_PUBLISH_ERROR',
    status: 503,
    message: 'Failed to publish event to message broker',
  },
} as const;
