import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { accents, contrast, flavors, makeTheme } from "../src/theme.mjs";

const palette = JSON.parse(readFileSync(new URL("../src/palette.json", import.meta.url), "utf8"));
const textPairs = [
  ["text", "canvas"],
  ["textMuted", "canvas"],
  ["sidebarForeground", "sidebarRowSelected"],
  ["sidebarMutedForeground", "sidebar"],
  ["placeholder", "input"],
  ["secondaryForeground", "secondary"],
  ["mutedForeground", "muted"],
  ["toolbarControlForeground", "toolbarControlHover"],
  ["terminalForeground", "terminalSelection"],
  ["accentForeground", "accent"],
  ["accentSurfaceForeground", "accentSurface"],
  ["messageActionForeground", "messageAction"],
  ["messageActionForeground", "messageActionHover"],
  ["codeForeground", "codeBackground"],
  ["errorForeground", "errorSurface"],
  ["warningForeground", "warningSurface"],
  ["updateForeground", "updateSurface"],
  ["searchMatchForeground", "searchMatchBackground"],
  ["searchMatchActiveForeground", "searchMatchActiveBackground"],
];

test("each flavor and accent generates a distinct T3 Code v1 theme", () => {
  const ids = new Set();
  for (const flavor of flavors) {
    for (const accent of accents) {
      const theme = makeTheme(flavor, accent);
      ids.add(theme.id);
      assert.equal(theme.version, 1);
      assert.equal(theme.appearance, palette[flavor].appearance);
      assert.equal(theme.colors.canvas, palette[flavor].colors.base);
      assert.equal(theme.colors.accent, palette[flavor].colors[accent]);
      assert.equal(Object.keys(theme.colors).length, 61);
      for (const color of Object.values(theme.colors)) {
        assert.match(color, /^#[0-9a-f]{6}$/, theme.id);
      }
      if (flavor === "latte") {
        assert.equal(theme.variants, undefined);
        assert.doesNotMatch(theme.css, /^:root\.dark/m);
      } else {
        assert.deepEqual(theme.variants, { light: makeTheme("latte", accent).colors });
        assert.match(theme.css, /^:root\.dark/m);
      }
    }
  }
  assert.equal(ids.size, 56);
});

test("each palette keeps text, focus, and interactive accents legible", () => {
  for (const flavor of flavors) {
    for (const accent of accents) {
      const { id, colors, css } = makeTheme(flavor, accent);
      for (const [foreground, background] of textPairs) {
        assert.ok(
          contrast(colors[foreground], colors[background]) >= 4.5,
          `${id} ${foreground} on ${background}`,
        );
      }
      assert.ok(contrast(colors.focus, colors.input) >= 3, `${id} focus`);
      assert.ok(contrast(colors.terminalCursor, colors.terminalBackground) >= 3, `${id} cursor`);
      const interaction = [...css.matchAll(/--catppuccin-interaction: (#[0-9a-f]{6});/g)].at(-1)[1];
      const sidebar = [...css.matchAll(/--catppuccin-sidebar-interaction: (#[0-9a-f]{6});/g)].at(-1)[1];
      for (const background of ["canvas", "surfaceRaised", "surfaceOverlay"]) {
        assert.ok(contrast(interaction, colors[background]) >= 4.5, `${id} interaction on ${background}`);
      }
      assert.ok(contrast(sidebar, colors.sidebarRowSelected) >= 4.5, `${id} selected sidebar row`);
    }
  }
});
