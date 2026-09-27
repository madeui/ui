// Vercel Web Analytics, as plain tags: the queue stub `track` (from
// @vercel/analytics, feedback.tsx) pushes into until Vercel's deferred
// insights script takes over, and that script, which records page views
// itself, client navigations included. No client component: the page ships
// no analytics code of its own. The root layout renders it in production
// builds only.

const queue = 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};';

export function Analytics() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: queue }} />
      <script defer src="/_vercel/insights/script.js" data-sdkn="@vercel/analytics/next" />
    </>
  );
}
