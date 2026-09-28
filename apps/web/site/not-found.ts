// "Did you mean": the pages closest to an address that has none. Pure: the
// 404 page runs it in the browser over the route list it is rendered with.

export interface RouteRef {
  route: string;
  title: string;
}

/** Edit distance (insertions, deletions, substitutions). */
function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j]!;
      row[j] = Math.min(above + 1, row[j - 1]! + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return row[b.length]!;
}

/** 1 for equal strings, 0 for nothing in common. */
const similarity = (a: string, b: string) => 1 - distance(a, b) / Math.max(a.length, b.length, 1);

/** A match must be at least this similar: a typo or two, never a different word. */
const THRESHOLD = 0.75;

/** The last segment of an address: the page's own name, what a reader mistypes. */
const leaf = (path: string) => path.slice(path.lastIndexOf('/') + 1);

/**
 * The closest pages to `path`, best first, at most `count`; none when nothing
 * is close. Pages are compared by their last segment, so a shared folder
 * (`/docs/components/`) never makes two different pages look alike; the
 * whole address breaks ties.
 */
export function closestRoutes(path: string, routes: RouteRef[], count = 3): RouteRef[] {
  // `/docs/Installation.html` names the page `installation`.
  const name = leaf(path.toLowerCase().replace(/\.[a-z]+$/u, ''));
  if (name === '') return [];
  return routes
    .map((ref) => ({ ref, score: similarity(name, leaf(ref.route)), whole: similarity(path, ref.route) }))
    .filter((entry) => entry.score >= THRESHOLD)
    .sort((a, b) => b.score - a.score || b.whole - a.whole)
    .slice(0, count)
    .map((entry) => entry.ref);
}

/** What the 404 offers: the best match as "Did you mean", then the other close matches (never the best one again). */
export function suggestions(path: string, routes: RouteRef[]): { best: RouteRef | undefined; others: RouteRef[] } {
  const [best, ...others] = closestRoutes(path, routes);
  return { best, others };
}
