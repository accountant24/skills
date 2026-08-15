# Accountant24 built-in plugin

The plugin that ships with [Accountant24](https://accountant24.ai), the local-first AI agent for personal finance. It follows the open [Agent Plugins](https://agent-plugins.org) format: a `plugin.json` at the root and one folder per skill under `skills/`, each with a `SKILL.md` in the [Agent Skills](https://agentskills.io) format.

The app bundles this plugin, so its skills are always available and need no setup. It is also the reference example for writing your own plugin, see [Create a plugin](https://accountant24.ai/docs/create-a-plugin).

## Skills

Skills are named `<plugin>:<skill>` inside the app. Type `/` in the message box to pick one, or just ask in your own words and the agent picks the matching skill by its description.

| Skill                             | What it does                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accountant24:recurring-spending` | Everything you pay regularly: bills and subscriptions, monthly and yearly totals, what is due in the next 30 days, price increases, payments that stopped arriving. |
| `accountant24:subscription-audit` | A cancel-focused review of subscriptions and memberships: cost per month and year, renewal dates, price increases, duplicates, forgotten charges.                   |
| `accountant24:create-plugin`      | Turns a routine you describe into a plugin of your own in `~/Accountant24/plugins`.                                                                                 |

## Layout

```
plugin.json                       manifest: name, version, description, author, license
skills/
  create-plugin/SKILL.md
  recurring-spending/SKILL.md
  subscription-audit/SKILL.md
```

## How it reaches users

The desktop app vendors this repository at a tagged release into its bundle (`packages/desktop/resources/plugins/accountant24` in [machulav/accountant24](https://github.com/machulav/accountant24), pinned in `packages/desktop/native-plugins.json`). A change lands in the app when that pin is bumped to a new tag and the app is released.

## Contributing

1. Edit a `SKILL.md`, or add a new folder under `skills/` with its own `SKILL.md`. Skill folder names are lowercase letters, numbers, and hyphens, and the frontmatter `name` must match the folder name.
2. Test the change in the app. The simplest way is to run the app from source with your working copy in place of the vendored folder: copy this repository into `packages/desktop/resources/plugins/accountant24` of an accountant24 checkout and start the app (`npm start`). In a released app the built-in copy takes precedence over a plugin with the same skill names, so testing there means installing your copy under a different plugin name and different skill folder names.
3. Open a pull request describing what changed and how you tested it. Keep the ledger vocabulary: accounts, not categories.

## License

Apache-2.0
