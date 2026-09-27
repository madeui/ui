import type { Metadata } from 'next';

import { IndexPage } from '@/components/landing/index-page';

export const metadata: Metadata = {
  title: { absolute: 'madeui — UI you own, down to the token' },
  description:
    'Base UI + StyleX components you own. Copied into your project as editable source, styled with compile-time tokens. Agent-friendly by design.',
};

export default function Home() {
  return <IndexPage />;
}
