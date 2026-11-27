import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { accents, flavors, makeTheme } from "../src/theme.mjs";

const args = process.argv.slice(2);
const check = args[0] === "--check";
if (args.length > Number(check)) {
  console.error("Usage: node scripts/generate.mjs [--check]");
  process.exit(1);
}

const directory = new URL("../themes/", import.meta.url);
const expected = new Map();

for (const flavor of flavors) {
  for (const accent of accents) {
    const theme = makeTheme(flavor, accent);
    expected.set(`${theme.id}.json`, JSON.stringify(theme, null, 2) + "\n");
  }
}

if (check) {
  const issues = [];
  for (const [name, contents] of expected) {
    const path = new URL(name, directory);
    if (!existsSync(path)) {
      issues.push(`Missing themes/${name}`);
    } else if (readFileSync(path, "utf8") !== contents) {
      issues.push(`Out of date themes/${name}`);
    }
  }
  if (existsSync(directory)) {
    for (const name of readdirSync(directory)) {
      if (name.endsWith(".json") && !expected.has(name)) {
        issues.push(`Unexpected themes/${name}`);
      }
    }
  }
  if (issues.length > 0) {
    console.error(issues.join("\n"));
    console.error("Run node scripts/generate.mjs to regenerate the theme files.");
    process.exit(1);
  }
} else {
  mkdirSync(directory, { recursive: true });
  for (const [name, contents] of expected) {
    writeFileSync(new URL(name, directory), contents);
  }
}

console.log(`${check ? "Verified" : "Generated"} ${expected.size} Catppuccin themes.`);
