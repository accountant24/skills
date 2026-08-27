---
name: create-plugin
description: Turns a routine the user describes into a plugin with a skill they can run again later, and updates the plugins the user created before. Use when the user asks to create a skill or a plugin, to save or remember a report or review they just asked for, to turn something they do regularly into a repeatable command, or to add to or change a plugin they made earlier. Ask things like "make this a skill", "save this as a plugin", "create a monthly review I can rerun", "add this skill to my plugin", or "change my monthly review to include savings".
---

# Create or edit a plugin

A plugin is a folder in `plugins/` inside the workspace (your working directory) holding a `plugin.json` manifest and one or more skills. A skill is a set of instructions you follow when the user invokes it.

This skill covers creating a new plugin, adding a skill to a plugin the user created earlier, and editing such a plugin or its skills.

Only touch plugins the user created. A plugin installed from the marketplace is listed under `plugins` in `app-settings.json` in the workspace, and a reinstall overwrites any local change to it. If the user wants an installed plugin to behave differently, create a plugin of their own instead.

The full plugin guide for the running app version is in `$ACCOUNTANT24_DOCS/create-a-plugin.md`. It covers the plugin format in full, testing, publishing to the marketplace, and troubleshooting. Read it whenever you are unsure or need more detail than this skill gives, and point the user to https://accountant24.ai/docs/create-a-plugin if they want to go deeper.

## 1. Understand the routine

Ask at most two or three short questions, only about what you cannot infer:

- What the skill should do and what the outcome is (a report, a change to the ledger, a file).
- What it works on (a period, accounts, a statement), if that is not obvious.
- Anything specific to the user's ledger or habits that a fresh session would not know.

If the user wants to save something they just did in this chat, you already know the routine. Skip the questions and write it.

## 2. Pick the names

- Plugin name: lowercase letters, numbers and hyphens, hyphens only in the middle, for example `monthly-review`.
- Skill name: same rules. A single-skill plugin usually reuses the plugin name.
- The user invokes the skill as `plugin-name:skill-name`, so keep both short.

Check that the plugin folder does not already exist, and that no other plugin already provides a skill with the same skill name.

When adding a skill to an existing plugin, keep the plugin name as is and pick only the skill name.

## 3. Write the files

Create `plugins/<plugin-name>/plugin.json`:

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "<plugin-name>",
  "description": "<one sentence on what the plugin is for>"
}
```

Create `plugins/<plugin-name>/skills/<skill-name>/SKILL.md`:

```markdown
---
name: <skill-name>
description: <when to use this skill, written so a model can match it to a request; name the questions a user would ask>
---

# <Title>

<Numbered steps to follow: what to do, in what order, and what the result should look like.>
```

Rules for the file:

- The `description` is what makes the skill activate, so write it for matching: say what the skill does and give a few example phrasings a user would type.
- The instructions must be concrete. Name the exact commands, files and steps, and what the result should look like, so a future session does the same thing without guessing.
- When a step touches the ledger, use the account names that exist in it, never invented spending categories.
- Keep it to the steps that matter. A skill is a playbook, not documentation.

If the routine splits into several distinct tasks, write one skill per task under the same plugin rather than one long skill.

When editing an existing plugin or skill, read its current files first, change only what the user asked for, and keep the rest intact.

## 4. Tell the user how to start using it

The app picks up the new or changed plugin on its own. Finish by telling the user the skill is ready to use. They can ask in their own words, or type `/` in the message box and pick `plugin-name:skill-name`. The plugin is listed under Settings → Plugins. If the skill does not show up, tell the user to restart the app.
