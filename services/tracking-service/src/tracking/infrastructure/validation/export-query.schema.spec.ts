import { exportQuerySchema } from './export-query.schema';

describe('exportQuerySchema', () => {
  it('should default format to json', async () => {
    const result = await exportQuerySchema.parseAsync({});
    expect(result.format).toBe('json');
  });

  it('should accept csv format', async () => {
    const result = await exportQuerySchema.parseAsync({ format: 'csv' });
    expect(result.format).toBe('csv');
  });

  it('should reject invalid format', async () => {
    await expect(
      exportQuerySchema.parseAsync({ format: 'xml' }),
    ).rejects.toThrow();
  });

  it('should accept all filter params', async () => {
    const result = await exportQuerySchema.parseAsync({
      format: 'json',
      from: '2024-01-01T00:00:00.000Z',
      to: '2024-12-31T23:59:59.000Z',
      component: 'Button',
      page: '/home',
    });
    expect(result.component).toBe('Button');
    expect(result.page).toBe('/home');
  });
});
