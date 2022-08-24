export type Cmpx = [number, number];

/**
 * Z(n+1) = Z(n)^2 + C
 * @see https://en.wikipedia.org/wiki/Mandelbrot_set
 */
export const mandelbrot = (C: Cmpx, limit: number) => {
  let i = 0;
  let Z = [0, 0];
  while (++i < limit && Z[0] * Z[0] + Z[1] * Z[1] < 4) {
    const a = Z[0];
    const b = Z[1];
    Z[0] = a * a - b * b + C[0];
    Z[1] = 2 * a * b + C[1];
  }
  return [i, Z] as const;
};

/**
 * Maps number from domain [a, b] into [c, d]
 */
export const map = (a: number, b: number, c: number, d: number) => {
  const s = (d - c) / (b - a);
  return (x: number) => (x - a) * s + c;
};

export const clamp = (a: number, b: number) => (x: number) =>
  Math.max(a, Math.min(b, x));

export interface Block {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const blocks = function* (
  width: number,
  height: number,
  size: number
): Generator<Block> {
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      yield {
        left: x,
        top: y,
        width: Math.min(width - 1, x + size) - x,
        height: Math.min(height - 1, y + size) - y,
      };
    }
  }
};
