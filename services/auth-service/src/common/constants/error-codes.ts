export const ErrorCodes = {
  // Authentication (401)
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    status: 401,
    message: 'Invalid email or password',
  },
  TOKEN_EXPIRED: { code: 'TOKEN_EXPIRED', status: 401, message: 'Token has expired' },
  TOKEN_INVALID: { code: 'TOKEN_INVALID', status: 401, message: 'Invalid token' },
  TOKEN_REVOKED: { code: 'TOKEN_REVOKED', status: 401, message: 'Token has been revoked' },
  TOKEN_BLACKLISTED: {
    code: 'TOKEN_BLACKLISTED',
    status: 401,
    message: 'Token has been blacklisted',
  },
  TOKEN_REUSE_DETECTED: {
    code: 'TOKEN_REUSE_DETECTED',
    status: 401,
    message: 'Token reuse detected. All sessions revoked.',
  },

  // Authorization (403)
  ACCOUNT_INACTIVE: { code: 'ACCOUNT_INACTIVE', status: 403, message: 'Account is inactive' },

  // Validation (400)
  INVALID_EMAIL_FORMAT: {
    code: 'INVALID_EMAIL_FORMAT',
    status: 400,
    message: 'Invalid email format',
  },
  WEAK_PASSWORD: {
    code: 'WEAK_PASSWORD',
    status: 400,
    message: 'Password does not meet requirements',
  },
  INVALID_INPUT: { code: 'INVALID_INPUT', status: 400, message: 'Request validation failed' },
  PASSWORD_REUSE: { code: 'PASSWORD_REUSE', status: 400, message: 'Cannot reuse current password' },
  MISSING_REQUIRED_FIELD: {
    code: 'MISSING_REQUIRED_FIELD',
    status: 400,
    message: 'Required field missing',
  },
  TOKEN_ALREADY_REVOKED: {
    code: 'TOKEN_ALREADY_REVOKED',
    status: 400,
    message: 'Token already revoked',
  },

  // Conflict (409)
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    status: 409,
    message: 'Email already registered',
  },

  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED: { code: 'RATE_LIMIT_EXCEEDED', status: 429, message: 'Too many attempts' },

  // Not Found (404)
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', status: 404, message: 'User not found' },

  // Server Errors (500)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
    message: 'Internal server error',
  },
  DATABASE_ERROR: { code: 'DATABASE_ERROR', status: 500, message: 'Database operation failed' },
  CACHE_ERROR: { code: 'CACHE_ERROR', status: 500, message: 'Cache operation failed' },
  KEY_OPERATION_ERROR: {
    code: 'KEY_OPERATION_ERROR',
    status: 500,
    message: 'Cryptographic operation failed',
  },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
