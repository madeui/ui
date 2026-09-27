import { describe, expect, test } from 'vitest';

import { showcaseSections } from '../site/showcase.ts';

const components = [
  { name: 'button', title: 'Button' },
  { name: 'button-group', title: 'Button Group' },
  { name: 'input', title: 'Input' },
  { name: 'input-otp', title: 'Input OTP' },
];

describe('showcaseSections', () => {
  test('one section per component, in registry order, each with the Examples named after it', () => {
    const sections = showcaseSections(components, [
      'button-demo',
      'button-group-demo',
      'button-group-split',
      'button-sizes',
      'input-file',
      'input-otp-demo',
    ]);
    expect(sections).toEqual([
      { name: 'button', title: 'Button', examples: ['button-demo', 'button-sizes'] },
      { name: 'button-group', title: 'Button Group', examples: ['button-group-demo', 'button-group-split'] },
      { name: 'input', title: 'Input', examples: ['input-file'] },
      { name: 'input-otp', title: 'Input OTP', examples: ['input-otp-demo'] },
    ]);
  });

  test('a component without Examples still gets its (empty) section', () => {
    const sections = showcaseSections(components, ['button-demo']);
    expect(sections.map((section) => [section.name, section.examples.length])).toEqual([
      ['button', 1],
      ['button-group', 0],
      ['input', 0],
      ['input-otp', 0],
    ]);
  });

  test('an Example named after no component is an error, not a silent omission', () => {
    expect(() => showcaseSections(components, ['button-demo', 'buttons-extra', 'card-demo'])).toThrow(
      /buttons-extra, card-demo/u,
    );
  });
});
