export const DomainErrors = {
  INVALID_COMPONENT_NAME: {
    code: 'INVALID_TRACKING_DATA',
    message: 'componentName is required and must be a non-empty string',
  },
  INVALID_VARIANT: {
    code: 'INVALID_TRACKING_DATA',
    message: 'variant is required and must be a non-empty string',
  },
  INVALID_ACTION: {
    code: 'INVALID_TRACKING_DATA',
    message: 'Invalid action. Valid actions: click, hover, focus, blur, submit, view, scroll, change',
  },
  INVALID_TIMESTAMP: {
    code: 'INVALID_TRACKING_DATA',
    message: 'Invalid timestamp format. Expected ISO 8601 in UTC (e.g. 2024-01-01T00:00:00Z).',
  },
  INVALID_SESSION_ID: {
    code: 'INVALID_TRACKING_DATA',
    message: 'sessionId is required and must be a non-empty string',
  },
  INVALID_PAGE_URL: {
    code: 'INVALID_TRACKING_DATA',
    message: 'pageUrl is required and must be a non-empty string',
  },
} as const;

export const VALID_ACTIONS = [
  'click',
  'hover',
  'focus',
  'blur',
  'submit',
  'view',
  'scroll',
  'change',
] as const;

