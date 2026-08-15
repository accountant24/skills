#!/usr/bin/env node
// Checks that this repository is a valid Accountant24 plugin: a plugin.json
// the app accepts, and a SKILL.md with a name and a description in every
// folder under skills/. Zero dependencies; runs on Node 22.
//
// The rules mirror what the desktop app enforces at install time
// (packages/desktop/src/main/agent/plugin-manifest.ts in machulav/accountant24),
// so a green check here means the app will load the plugin.
//
// Usage: node scripts/check.mjs [plugin-dir]

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] ?? ".";
const errors = [];

// --- plugin.json ------------------------------------------------------------

const KNOWN_KEYS = new Set([
  "$schema",
  "name",
  "version",
  "description",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "extensions",
]);

function pluginNameError(name) {
  if (name.length === 0) return "name is empty";
  if (name.length > 64) return "name exceeds 64 characters";
  if (!/^[a-z0-9-]+$/.test(name)) return "name may only contain lowercase letters, numbers, and hyphens";
  if (name.startsWith("-") || name.endsWith("-")) return "name may not start or end with a hyphen";
  if (name.includes("--")) return "name may not contain consecutive hyphens";
  return undefined;
}

function checkManifest() {
  const file = join(root, "plugin.json");
  if (!existsSync(file)) {
    errors.push("plugin.json: missing");
    return undefined;
  }
  let raw;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    errors.push("plugin.json: not valid JSON");
    return undefined;
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    errors.push("plugin.json: must contain a JSON object");
    return undefined;
  }
  const unknown = Object.keys(raw).filter((key) => !KNOWN_KEYS.has(key));
  if (unknown.length > 0) errors.push(`plugin.json: unknown field ${unknown.sort().join(", ")}`);
  if (typeof raw.name !== "string") {
    errors.push("plugin.json: name is required");
  } else {
    const nameError = pluginNameError(raw.name);
    if (nameError) errors.push(`plugin.json: ${nameError}`);
  }
  for (const key of ["version", "description", "homepage", "repository", "license"]) {
    if (raw[key] !== undefined && typeof raw[key] !== "string") errors.push(`plugin.json: ${key} must be a string`);
  }
  if (typeof raw.version === "string" && !/^\d+\.\d+\.\d+/.test(raw.version)) {
    errors.push("plugin.json: version must look like 1.2.3");
  }
  if (raw.author !== undefined) {
    if (typeof raw.author !== "object" || raw.author === null || Array.isArray(raw.author)) {
      errors.push("plugin.json: author must be an object");
    } else {
      for (const key of ["name", "email", "url"]) {
        if (raw.author[key] !== undefined && typeof raw.author[key] !== "string") {
          errors.push(`plugin.json: author.${key} must be a string`);
        }
      }
    }
  }
  if (raw.keywords !== undefined && (!Array.isArray(raw.keywords) || raw.keywords.some((k) => typeof k !== "string"))) {
    errors.push("plugin.json: keywords must be an array of strings");
  }
  return raw;
}

// --- skills/*/SKILL.md ------------------------------------------------------

/** The subset of YAML that skill frontmatter uses: `key: value` at the top
 *  level, quoted or plain, plus `>`/`|` block scalars and indented
 *  continuation lines. Returns a key → string map, or undefined when there is
 *  no frontmatter block at all. */
function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) return undefined;
  const lines = match[1].split(/\r?\n/);
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([A-Za-z0-9_-]+):(?:\s+(.*))?$/.exec(lines[i]);
    if (!kv) continue;
    const key = kv[1];
    let value = (kv[2] ?? "").trim();
    if (value === "" || /^[>|][+-]?$/.test(value)) {
      const literal = value.startsWith("|");
      const block = [];
      while (i + 1 < lines.length && (/^\s/.test(lines[i + 1]) || lines[i + 1].trim() === "")) {
        block.push(lines[++i].trim());
      }
      while (block.length > 0 && block[block.length - 1] === "") block.pop();
      value = literal ? block.join("\n") : block.join(" ").replace(/\s+/g, " ").trim();
    } else {
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) value += ` ${lines[++i].trim()}`;
      if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      } else if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1).replace(/''/g, "'");
      }
    }
    out[key] = value;
  }
  return out;
}

function checkSkills() {
  const dir = join(root, "skills");
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    errors.push("skills/: missing");
    return;
  }
  const folders = readdirSync(dir).filter((name) => !name.startsWith(".") && statSync(join(dir, name)).isDirectory());
  if (folders.length === 0) errors.push("skills/: no skill folders");
  for (const folder of folders) {
    const file = join(dir, folder, "SKILL.md");
    const label = `skills/${folder}/SKILL.md`;
    if (!existsSync(file)) {
      errors.push(`${label}: missing`);
      continue;
    }
    const fm = parseFrontmatter(readFileSync(file, "utf8"));
    if (!fm) {
      errors.push(`${label}: no frontmatter block`);
      continue;
    }
    if (!fm.name) errors.push(`${label}: frontmatter has no name`);
    else if (fm.name !== folder) errors.push(`${label}: name "${fm.name}" does not match the folder name`);
    if (!fm.description) errors.push(`${label}: frontmatter has no description`);
  }
}

checkManifest();
checkSkills();

if (errors.length > 0) {
  for (const error of errors) console.error(`✗ ${error}`);
  process.exit(1);
}
console.log("✓ plugin.json and skills look good");
