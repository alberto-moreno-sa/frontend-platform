export interface DeviceInfo {
  readonly deviceId: string;
  readonly ipAddress: string;
  readonly userAgent: string;
}

export const createDeviceInfo = (
  deviceId: string,
  ipAddress: string,
  userAgent: string,
): DeviceInfo => ({
  deviceId: deviceId || 'unknown',
  ipAddress: ipAddress || '0.0.0.0',
  userAgent: userAgent || 'unknown',
});
