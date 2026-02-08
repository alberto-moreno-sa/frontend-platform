import { statsQuerySchema } from './stats-query.schema';

describe('statsQuerySchema', () => {
  it('should accept empty query', async () => {
    const result = await statsQuerySchema.parseAsync({});
    expect(result).toBeDefined();
  });

  it('should accept valid from/to dates', async () => {
    const result = await statsQuerySchema.parseAsync({
      from: '2024-01-01T00:00:00.000Z',
      to: '2024-12-31T23:59:59.000Z',
    });
    expect(result.from).toBeDefined();
  });

  it('should accept component filter', async () => {
    const result = await statsQuerySchema.parseAsync({ component: 'Button' });
    expect(result.component).toBe('Button');
  });

  it('should reject invalid datetime format', async () => {
    await expect(
      statsQuerySchema.parseAsync({ from: 'not-a-date' }),
    ).rejects.toThrow();
  });
});
