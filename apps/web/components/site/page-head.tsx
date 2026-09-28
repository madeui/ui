import { discoveryLinks, jsonLdScript } from '@/site/head';

/**
 * The parts of a page's head that Next.js Metadata has no field for: the two
 * `describedby` links (React hoists <link> into <head>) and the JSON-LD graph
 * (a script in the page). Server-rendered markup only; no client code.
 */
export function PageHead({ jsonLd, discovery = true }: { jsonLd: object; discovery?: boolean }) {
  return (
    <>
      {discovery
        ? discoveryLinks.map((link) => <link key={link.href} rel="describedby" href={link.href} type={link.type} />)
        : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
    </>
  );
}
