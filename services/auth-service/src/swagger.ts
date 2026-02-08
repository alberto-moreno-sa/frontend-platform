export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Auth Service API',
    description:
      'Enterprise-grade authentication and authorization service with JWT ES256, MongoDB, and Redis.',
    version: '2.0.0',
  },
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication operations (register, login, logout, refresh, verify)',
    },
    { name: 'User', description: 'User profile and session management' },
    { name: 'JWKS', description: 'JSON Web Key Set endpoint for public key distribution' },
    { name: 'Health', description: 'Service health check' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http' as const,
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'ES256 signed JWT access token',
      },
    },
    schemas: {
      Error: {
        type: 'object' as const,
        properties: {
          success: { type: 'boolean' as const, example: false },
          error: {
            type: 'object' as const,
            properties: {
              code: { type: 'string' as const },
              message: { type: 'string' as const },
            },
          },
        },
      },
      UserResponse: {
        type: 'object' as const,
        properties: {
          id: { type: 'string' as const },
          email: { type: 'string' as const, format: 'email' },
          name: { type: 'string' as const },
          emailVerified: { type: 'boolean' as const },
          createdAt: { type: 'string' as const, format: 'date-time' },
        },
      },
      AuthTokens: {
        type: 'object' as const,
        properties: {
          access_token: { type: 'string' as const },
          refresh_token: { type: 'string' as const },
          expires_in: { type: 'integer' as const },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object' as const,
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string' as const, format: 'email', example: 'user@example.com' },
                  password: { type: 'string' as const, minLength: 8, example: 'SecurePass123' },
                  name: { type: 'string' as const, minLength: 2, example: 'John Doe' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '409': { description: 'Email already exists' },
          '400': { description: 'Invalid input' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object' as const,
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string' as const, format: 'email', example: 'user@example.com' },
                  password: { type: 'string' as const, example: 'SecurePass123' },
                  deviceId: { type: 'string' as const, example: 'device-001' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token using refresh token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object' as const,
                required: ['refresh_token'],
                properties: {
                  refresh_token: { type: 'string' as const },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Tokens refreshed' },
          '401': { description: 'Invalid or expired refresh token' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout current session',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object' as const,
                required: ['refresh_token'],
                properties: {
                  refresh_token: { type: 'string' as const },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Logged out successfully' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/auth/verify-token': {
      post: {
        tags: ['Auth'],
        summary: 'Verify an access token',
        description: 'Send the token in the Authorization: Bearer header',
        responses: {
          '200': { description: 'Token is valid' },
          '401': { description: 'Token invalid or expired' },
        },
      },
    },
    '/api/user/profile': {
      get: {
        tags: ['User'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Profile data' },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['User'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object' as const,
                required: ['name'],
                properties: {
                  name: { type: 'string' as const, minLength: 2, maxLength: 100 },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Profile updated' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/user/account': {
      delete: {
        tags: ['User'],
        summary: 'Delete account (soft delete)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object' as const,
                required: ['password'],
                properties: {
                  password: { type: 'string' as const },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Account deleted' },
          '401': { description: 'Invalid password' },
        },
      },
    },
    '/api/user/sessions': {
      get: {
        tags: ['User'],
        summary: 'List active sessions',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'List of active sessions' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/.well-known/jwks.json': {
      get: {
        tags: ['JWKS'],
        summary: 'Get JSON Web Key Set',
        description: 'Returns the public ES256 keys used for JWT verification',
        responses: {
          '200': { description: 'JWKS response with public keys' },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Service health check',
        description: 'Returns MongoDB and Redis connection status',
        responses: {
          '200': { description: 'All services healthy' },
          '503': { description: 'One or more services unhealthy' },
        },
      },
    },
  },
};
