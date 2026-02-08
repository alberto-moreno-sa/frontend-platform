import { Left, Right } from './either';

describe('Either', () => {
  describe('Left', () => {
    it('should create a Left value', () => {
      const left = Left('error');
      expect(left._tag).toBe('Left');
      expect(left.isLeft).toBe(true);
      expect(left.isRight).toBe(false);
      expect(left.value).toBe('error');
    });

    it('should fold using the left function', () => {
      const left = Left('err');
      const result = left.fold(
        (l: string) => `left: ${l}`,
        (r: string) => `right: ${r}`,
      );
      expect(result).toBe('left: err');
    });
  });

  describe('Right', () => {
    it('should create a Right value', () => {
      const right = Right(42);
      expect(right._tag).toBe('Right');
      expect(right.isLeft).toBe(false);
      expect(right.isRight).toBe(true);
      expect(right.value).toBe(42);
    });

    it('should fold using the right function', () => {
      const right = Right('ok');
      const result = right.fold(
        (l: string) => `left: ${l}`,
        (r: string) => `right: ${r}`,
      );
      expect(result).toBe('right: ok');
    });
  });
});
