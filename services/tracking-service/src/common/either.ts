/**
 * Either monad for representing operations that can fail.
 * Left holds the error value, Right holds the success value.
 * Use `isLeft`/`isRight` for type narrowing, or `fold` to handle both branches.
 */
export interface Left<L> {
  readonly _tag: 'Left';
  readonly value: L;
  readonly isLeft: true;
  readonly isRight: false;
  fold: <R, T>(onLeft: (l: L) => T, onRight: (r: R) => T) => T;
}

export interface Right<R> {
  readonly _tag: 'Right';
  readonly value: R;
  readonly isLeft: false;
  readonly isRight: true;
  fold: <L, T>(onLeft: (l: L) => T, onRight: (r: R) => T) => T;
}

export type Either<L, R> = Left<L> | Right<R>;

export const Left = <L>(value: L): Left<L> => ({
  _tag: 'Left',
  value,
  isLeft: true,
  isRight: false,
  fold: <_R, T>(onLeft: (l: L) => T, _onRight: (_r: _R) => T): T => onLeft(value),
});

export const Right = <R>(value: R): Right<R> => ({
  _tag: 'Right',
  value,
  isLeft: false,
  isRight: true,
  fold: <_L, T>(_onLeft: (_l: _L) => T, onRight: (r: R) => T): T => onRight(value),
});
