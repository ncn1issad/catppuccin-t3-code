import { readFileSync } from "node:fs";

const palette = JSON.parse(readFileSync(new URL("./palette.json", import.meta.url), "utf8"));
const interactions = readFileSync(new URL("./interactions.css", import.meta.url), "utf8").trim();

export const flavors = ["latte", "frappe", "macchiato", "mocha"];
export const accents = [
  "rosewater", "flamingo", "pink", "mauve", "red", "maroon", "peach",
  "yellow", "green", "teal", "sky", "sapphire", "blue", "lavender",
];

const black = "#000000";
const white = "#ffffff";

function rgb(hex) {
  return hex.slice(1).match(/../g).map((channel) => Number.parseInt(channel, 16));
}

function mix(first, second, amount) {
  const end = rgb(second);
  return "#" + rgb(first).map((channel, index) =>
    Math.round(channel + (end[index] - channel) * amount).toString(16).padStart(2, "0"),
  ).join("");
}

function luminance(color) {
  const [red, green, blue] = rgb(color).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function foregroundOn(background, colors) {
  const extremes = luminance(background) >= 0.179 ? [black, white] : [white, black];
  return [colors.base, colors.text, colors.crust, ...extremes].find(
    (foreground) => contrast(foreground, background) >= 4.5,
  );
}

// Keep the palette color where it passes. For denser controls, shade or tint it
// just enough to make small text readable on each of its backgrounds.
function readableTone(color, backgrounds, dark, minimum = 4.5) {
  const end = dark ? white : black;
  for (let percent = 0; percent <= 100; percent += 1) {
    const candidate = mix(color, end, percent / 100);
    if (backgrounds.every((background) => contrast(candidate, background) >= minimum)) {
      return candidate;
    }
  }
  throw new Error(`Cannot reach ${minimum}:1 contrast for ${color} on ${backgrounds.join(", ")}`);
}

function createPalette(flavorId, accentId) {
  const { appearance, colors: swatches } = palette[flavorId];
  const dark = appearance === "dark";
  const accent = swatches[accentId];
  const actionForeground = foregroundOn(accent, swatches);
  const hoverTarget = luminance(actionForeground) < luminance(accent) ? white : black;

  const border = dark ? swatches.surface1 : swatches.surface0;
  const statusSurface = dark ? swatches.surface0 : swatches.crust;
  const foregroundOnStatus = (color) => readableTone(color, [swatches.base, statusSurface], dark);
  const search = mix(swatches.base, swatches.yellow, dark ? 0.66 : 0.5);
  const focusBackgrounds = [swatches.base, swatches.mantle, swatches.crust, swatches.surface0, swatches.surface2];

  return {
    colors: {
      canvas: swatches.base,
      chrome: swatches.mantle,
      toolbar: swatches.mantle,
      toolbarForeground: swatches.text,
      toolbarBorder: border,
      toolbarControl: statusSurface,
      toolbarControlForeground: swatches.text,
      toolbarControlHover: border,
      surface: swatches.base,
      surfaceRaised: swatches.surface0,
      surfaceOverlay: swatches.surface1,
      text: swatches.text,
      textMuted: readableTone(swatches.subtext0, [swatches.base, swatches.mantle], dark),
      border,
      input: swatches.surface0,
      focus: readableTone(accent, focusBackgrounds, dark, 3),
      accent,
      accentForeground: actionForeground,
      secondary: border,
      secondaryForeground: swatches.text,
      muted: statusSurface,
      mutedForeground: readableTone(swatches.subtext0, [statusSurface], dark),
      placeholder: readableTone(swatches.overlay0, [swatches.surface0, swatches.base], dark),
      secondaryLabel: readableTone(swatches.subtext1, [swatches.base, swatches.mantle], dark),
      iconMuted: readableTone(swatches.overlay1, [swatches.base, swatches.surface0], dark, 3),
      error: swatches.red,
      errorForeground: foregroundOnStatus(swatches.red),
      errorSurface: statusSurface,
      warning: swatches.yellow,
      warningForeground: foregroundOnStatus(swatches.yellow),
      warningSurface: statusSurface,
      update: accent,
      updateForeground: foregroundOnStatus(accent),
      updateSurface: statusSurface,
      accentSurface: statusSurface,
      accentSurfaceForeground: foregroundOnStatus(accent),
      messageSurface: swatches.mantle,
      messageForeground: swatches.text,
      messageAction: accent,
      messageActionForeground: actionForeground,
      messageActionHover: mix(accent, hoverTarget, dark ? 0.24 : 0.14),
      codeBackground: swatches.mantle,
      codeForeground: swatches.text,
      searchMatchBackground: search,
      searchMatchForeground: foregroundOn(search, swatches),
      searchMatchActiveBackground: swatches.peach,
      searchMatchActiveForeground: foregroundOn(swatches.peach, swatches),
      sidebar: swatches.crust,
      sidebarForeground: readableTone(swatches.text, [swatches.crust, swatches.surface2], dark),
      sidebarMutedForeground: readableTone(swatches.subtext0, [swatches.crust], dark),
      sidebarControlSurface: swatches.base,
      sidebarRowHover: swatches.surface0,
      sidebarRowActive: swatches.surface1,
      sidebarRowSelected: swatches.surface2,
      sidebarBorder: border,
      terminalBackground: swatches.crust,
      terminalForeground: swatches.text,
      terminalCursor: readableTone(accent, [swatches.crust], dark, 3),
      terminalSelection: border,
      terminalScrollbar: border,
      terminalScrollbarHover: dark ? swatches.surface2 : swatches.surface1,
    },
    interaction: readableTone(accent, [swatches.base, swatches.mantle, swatches.crust, swatches.surface0, swatches.surface1], dark),
    sidebarInteraction: readableTone(accent, focusBackgrounds, dark),
  };
}

function interactionVariables(selector, { interaction, sidebarInteraction }) {
  return [
    `${selector} {`,
    `  --catppuccin-interaction: ${interaction};`,
    `  --catppuccin-sidebar-interaction: ${sidebarInteraction};`,
    "}",
  ].join("\n");
}

export function makeTheme(flavorId, accentId) {
  const flavor = palette[flavorId];
  const primary = createPalette(flavorId, accentId);
  const dark = flavor.appearance === "dark";
  const light = dark ? createPalette("latte", accentId) : primary;
  const lightRoot = ":root:not(.dark)";
  const css = [
    interactionVariables(lightRoot, light),
    ...(dark ? [interactionVariables(":root.dark", primary)] : []),
    interactions.replaceAll(":root", dark ? ":root" : lightRoot),
  ].join("\n\n");
  const accentName = accentId[0].toUpperCase() + accentId.slice(1);

  return {
    version: 1,
    id: `catppuccin-${flavorId}-${accentId}`,
    name: `Catppuccin ${flavor.name} (${accentName})`,
    appearance: flavor.appearance,
    collection: { id: "catppuccin", label: "Catppuccin" },
    colors: primary.colors,
    ...(dark ? { variants: { light: light.colors } } : {}),
    css,
  };
}
