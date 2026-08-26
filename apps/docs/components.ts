import { defineComponents } from 'blume';

export default defineComponents({
  mdx: {
    // Replace the built-in iframe-isolated example preview with an inline one
    // so portaled UI (dialogs, popovers, toasts) overlays the whole docs site.
    Component: './components/ExampleInline.astro',
  },
});
