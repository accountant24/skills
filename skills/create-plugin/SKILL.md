---
name: create-plugin
description: Turns a routine the user describes into a reusable plugin they can run again later. Use when the user asks to create a skill or a plugin, to save or remember a report or review they just asked for, or to turn something they do regularly into a repeatable command. Ask things like "make this a skill", "save this as a plugin", "create a monthly review I can rerun", or "turn this into something I can use every month".
---

# Create a plugin

A plugin is a folder in `~/Accountant24/plugins` holding a `plugin.json` manifest and one or more skills. A skill is a set of instructions you follow when the user invokes it.

## 1. Understand the routine

Ask at most two or three short questions, only about what you cannot infer:

- What the routine should produce (a list, a comparison, a total).
- Which period or accounts it covers, if that is not obvious.
- Anything specific to the user's ledger that a fresh session would not know.

If the user just asked for a report and now wants it saved, you already know the routine. Skip the questions and write it.

## 2. Pick the names

- Plugin name: lowercase letters, numbers and hyphens, hyphens only in the middle, for example `monthly-review`.
- Skill name: same rules. A single-skill plugin usually reuses the plugin name.
- The user invokes the skill as `plugin-name:skill-name`, so keep both short.

Check that the plugin folder does not already exist, and that no other plugin already provides a skill with the same skill name.

## 3. Write the files

Create `~/Accountant24/plugins/<plugin-name>/plugin.json`:

```json
{
  "name": "<plugin-name>",
  "description": "<one sentence on what the plugin is for>"
}
```

Create `~/Accountant24/plugins/<plugin-name>/skills/<skill-name>/SKILL.md`:

```markdown
---
name: <skill-name>
description: <when to use this skill, written so a model can match it to a request; name the questions a user would ask>
---

# <Title>

<Numbered steps to follow: which queries to run, how to interpret them, and how to present the result.>
```

Rules for the file:

- The `description` is what makes the skill activate, so write it for matching: say what the skill does and give a few example phrasings a user would type.
- The instructions must be concrete. Name the exact queries to run and the shape of the output, so a future session produces the same report without guessing.
- Use ledger account names, never invented spending categories.
- Keep it to the steps that matter. A skill is a playbook, not documentation.

If the routine needs several distinct reports, write one skill per report under the same plugin rather than one long skill.

## 4. Tell the user how to switch it on

A plugin you write starts switched off, because the app only runs plugins the user has approved. Finish by telling the user to open Settings, go to Plugins, and switch on the new plugin. After that they can invoke it by typing `/` in the message box and picking `plugin-name:skill-name`.
