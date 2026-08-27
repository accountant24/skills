---
name: docs
description: Answers questions about the Accountant24 app itself from its bundled documentation, which describes the exact app version that is running. Use when the user asks how the app works, what a feature does, or how to do something in the app, even if you already know the answer. Ask things like "how do plugins work", "where is my data stored", "is my data private", "does it work offline", "how do I use a local model", "what can I ask you", or "how does the marketplace work". For questions about the user's own money, answer from the ledger instead.
---

# Answer from the app's documentation

The app ships its documentation as markdown files in the folder named by the `ACCOUNTANT24_DOCS` environment variable. They describe the exact version of the app that is running, so prefer them over your own knowledge of the app.

## Steps

1. Read `$ACCOUNTANT24_DOCS/contents.md`. It lists every page with a one-line summary. Pick the page that covers the question.
2. Read the page from `$ACCOUNTANT24_DOCS/<page>.md` and answer from it, in your own words.
3. When it helps, give the user the live page link: `https://accountant24.ai/docs/<page>` (the `index` page is just `https://accountant24.ai`).

If `ACCOUNTANT24_DOCS` is not set, answer from the live site instead and link the page.

## Rules

- Answer only what the docs support. If the docs don't cover the question, say so rather than guessing about the app.
- Questions about the user's own money are not documentation questions. Answer those from the ledger as usual.
