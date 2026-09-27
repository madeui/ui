# madeui

A UI library whose components are copied into the user's project as source
the user owns, distributed through a registry and a CLI.

## Language

**Registry**:
The published set of items the CLI and shadcn-compatible tools install from; it only ever holds the current version of each item.
_Avoid_: catalog, package

**Item**:
One installable unit in the Registry — a component or a lib bundle such as the design tokens — made of one or more files, each with a target path in the project.
_Avoid_: package, module

**Registry dependency**:
An Item another Item needs and that `add` installs alongside it.

**Installed item**:
An Item with at least one of its files present at its target path in the project. Nothing records what was installed; presence on disk is the only signal.

**Same / Differs / Missing**:
The state of one file of an Installed item compared with the Registry: identical content, different content, or absent from disk. _Differs_ never says who changed the file — the project, the Registry, or both.
_Avoid_: modified, outdated, drift

**Example**:
One file in `packages/registry/examples/` that renders one feature or variant of a component. A docs page embeds it with `<Component path="…" />`, which shows it live with its source; the Markdown mirror inlines that source as a fenced block.
_Avoid_: demo, story, snippet

**Markdown mirror**:
The agent-facing copy of a docs page at `/<route>.md` (the page's source with each Example's source inlined) and `/<route>.mdx` (the source verbatim). `/index.md` mirrors the landing page and equals `llms.txt`.
_Avoid_: raw page, markdown export

**Agent artifact**:
A machine-readable file the docs site publishes for coding agents and crawlers: `llms.txt`, `llms-full.txt`, the Markdown mirrors, `agent-readability.json`, `robots.txt`, `sitemap.xml`, the changelog feed and the OG images.
_Avoid_: AI files, SEO files

**Published URL**:
A URL whose bytes and meaning are a contract: every sitemap URL, every Agent artifact, and the Registry at `/r/*.json`. Changing one is a deliberate decision; everything else the site serves may change freely.
_Avoid_: public URL, permalink

## Example dialogue

> **Dev:** "`diff` says button differs — did you ship an update?"
> **Maintainer:** "Maybe. Differs only means your copy and the Registry's don't match; read the patch to see whose lines they are."
