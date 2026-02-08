import { createDeviceInfo } from './device-info.vo';

describe('DeviceInfo Value Object', () => {
  it('should create device info with provided values', () => {
    const info = createDeviceInfo('device-1', '192.168.1.1', 'Mozilla/5.0');

    expect(info.deviceId).toBe('device-1');
    expect(info.ipAddress).toBe('192.168.1.1');
    expect(info.userAgent).toBe('Mozilla/5.0');
  });

  it('should default empty deviceId to unknown', () => {
    const info = createDeviceInfo('', '1.2.3.4', 'ua');
    expect(info.deviceId).toBe('unknown');
  });

  it('should default empty ipAddress to 0.0.0.0', () => {
    const info = createDeviceInfo('d', '', 'ua');
    expect(info.ipAddress).toBe('0.0.0.0');
  });

  it('should default empty userAgent to unknown', () => {
    const info = createDeviceInfo('d', '1.2.3.4', '');
    expect(info.userAgent).toBe('unknown');
  });
});
