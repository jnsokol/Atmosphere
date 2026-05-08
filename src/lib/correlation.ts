/** Pearson correlation between two equal-length numeric arrays. */
export function pearson(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length) throw new Error("length mismatch");
  const n = xs.length;
  if (n < 2) return 0;

  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

export function meanBy<T>(rows: T[], pick: (r: T) => number): number {
  if (rows.length === 0) return 0;
  return rows.reduce((a, r) => a + pick(r), 0) / rows.length;
}
