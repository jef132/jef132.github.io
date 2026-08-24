# Project notes for Claude

## Writing style

**Never use em-dashes (—) in any copy on this site.** This includes body prose,
headings, card text, metadata (title tag, meta description, alt text, Schema.org
fields), and commit messages. Em-dashes read as a tell that text was written by
an AI, and the owner does not want that on his personal site.

Do not substitute en-dashes (–) either.

Use instead, depending on what the sentence needs:

- **Comma** for a simple aside or a trailing clause.
  `...hands-on technical development, from architecting Zero Trust security...`
- **Period** when two shorter sentences hit harder than one long one.
  `I don't micromanage. I set clear direction, then spend my time...`
- **Colon** when the second half explains or introduces a list.
  `...handle task categories: answering IT questions via RAG, querying...`
- **Semicolon** for two tightly linked independent clauses.
  `...don't just oversee technology; they build it.`
- **Middot (`&middot;`)** as a separator inside titles and credential lines.
  This matches the existing style used throughout the Credentials section.
  `Situational Leadership II (SLII) &middot; Adaptive Leadership &amp; Coaching`
- **Pipe (`|`)** in the hero tagline and the page title tag.
  `Jef Aldrich | Technology Leader, AI Transformation & Cybersecurity Strategist`

Prefer natural phrasing over separators in `alt` text, since screen readers read
it aloud and characters like `|` produce awkward output.

Before opening a PR that touches copy, verify nothing slipped through:

```sh
grep -rn "—\|–\|&mdash;\|&ndash;" src/ scripts/
```
