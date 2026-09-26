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

## Example dialogue

> **Dev:** "`diff` says button differs — did you ship an update?"
> **Maintainer:** "Maybe. Differs only means your copy and the Registry's don't match; read the patch to see whose lines they are."
