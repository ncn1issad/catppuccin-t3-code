# Catppuccin for [T3 Code](https://t3.codes)

Soothing pastel themes for T3 Code on desktop and web. Choose from four Catppuccin flavors and all 14 accent colors.

## Previews

![T3 Code with the Lavender accent in Latte, Frappé, Macchiato, and Mocha](assets/preview.webp)

[🌻 Latte](assets/latte.webp) · [🪴 Frappé](assets/frappe.webp) · [🌺 Macchiato](assets/macchiato.webp) · [🌿 Mocha](assets/mocha.webp)

## Usage

Verified with T3 Code v0.1.13.

1. Choose a theme from the table below. On GitHub, open **Raw** to copy the JSON.
2. In T3 Code, open **Settings → Appearance → Create theme → Import theme**. Paste the JSON or select the saved file.
3. Select the imported theme. Frappé, Macchiato, and Mocha each include Latte in the same accent for light mode. To pair two different accents, select the light and dark halves independently in **Settings → Appearance**.

On a machine running a T3 Code environment, publish and select a theme for that environment with the CLI. Run this from the repository root.

```sh
t3 theme set ./themes/catppuccin-mocha-lavender.json
```

T3 Code v0.1.13 lists up to 32 environment theme files. Publish a selection that fits the limit, including any themes already installed. [T3 Code appearance docs](https://github.com/pingdotgg/t3code/blob/main/docs/user/appearance.md)

## Themes

| Accent | 🌻 Latte | 🪴 Frappé | 🌺 Macchiato | 🌿 Mocha |
| --- | --- | --- | --- | --- |
| Rosewater | [JSON](themes/catppuccin-latte-rosewater.json) | [JSON](themes/catppuccin-frappe-rosewater.json) | [JSON](themes/catppuccin-macchiato-rosewater.json) | [JSON](themes/catppuccin-mocha-rosewater.json) |
| Flamingo | [JSON](themes/catppuccin-latte-flamingo.json) | [JSON](themes/catppuccin-frappe-flamingo.json) | [JSON](themes/catppuccin-macchiato-flamingo.json) | [JSON](themes/catppuccin-mocha-flamingo.json) |
| Pink | [JSON](themes/catppuccin-latte-pink.json) | [JSON](themes/catppuccin-frappe-pink.json) | [JSON](themes/catppuccin-macchiato-pink.json) | [JSON](themes/catppuccin-mocha-pink.json) |
| Mauve | [JSON](themes/catppuccin-latte-mauve.json) | [JSON](themes/catppuccin-frappe-mauve.json) | [JSON](themes/catppuccin-macchiato-mauve.json) | [JSON](themes/catppuccin-mocha-mauve.json) |
| Red | [JSON](themes/catppuccin-latte-red.json) | [JSON](themes/catppuccin-frappe-red.json) | [JSON](themes/catppuccin-macchiato-red.json) | [JSON](themes/catppuccin-mocha-red.json) |
| Maroon | [JSON](themes/catppuccin-latte-maroon.json) | [JSON](themes/catppuccin-frappe-maroon.json) | [JSON](themes/catppuccin-macchiato-maroon.json) | [JSON](themes/catppuccin-mocha-maroon.json) |
| Peach | [JSON](themes/catppuccin-latte-peach.json) | [JSON](themes/catppuccin-frappe-peach.json) | [JSON](themes/catppuccin-macchiato-peach.json) | [JSON](themes/catppuccin-mocha-peach.json) |
| Yellow | [JSON](themes/catppuccin-latte-yellow.json) | [JSON](themes/catppuccin-frappe-yellow.json) | [JSON](themes/catppuccin-macchiato-yellow.json) | [JSON](themes/catppuccin-mocha-yellow.json) |
| Green | [JSON](themes/catppuccin-latte-green.json) | [JSON](themes/catppuccin-frappe-green.json) | [JSON](themes/catppuccin-macchiato-green.json) | [JSON](themes/catppuccin-mocha-green.json) |
| Teal | [JSON](themes/catppuccin-latte-teal.json) | [JSON](themes/catppuccin-frappe-teal.json) | [JSON](themes/catppuccin-macchiato-teal.json) | [JSON](themes/catppuccin-mocha-teal.json) |
| Sky | [JSON](themes/catppuccin-latte-sky.json) | [JSON](themes/catppuccin-frappe-sky.json) | [JSON](themes/catppuccin-macchiato-sky.json) | [JSON](themes/catppuccin-mocha-sky.json) |
| Sapphire | [JSON](themes/catppuccin-latte-sapphire.json) | [JSON](themes/catppuccin-frappe-sapphire.json) | [JSON](themes/catppuccin-macchiato-sapphire.json) | [JSON](themes/catppuccin-mocha-sapphire.json) |
| Blue | [JSON](themes/catppuccin-latte-blue.json) | [JSON](themes/catppuccin-frappe-blue.json) | [JSON](themes/catppuccin-macchiato-blue.json) | [JSON](themes/catppuccin-mocha-blue.json) |
| Lavender | [JSON](themes/catppuccin-latte-lavender.json) | [JSON](themes/catppuccin-frappe-lavender.json) | [JSON](themes/catppuccin-macchiato-lavender.json) | [JSON](themes/catppuccin-mocha-lavender.json) |

## Development

All 56 JSON files come from the same [theme mapping](src/theme.mjs), [interaction CSS](src/interactions.css), and [Catppuccin v1.8.0 palette](https://github.com/catppuccin/palette/blob/v1.8.0/palette.json). The mapping carries over the sidebar, toolbar, composer, and terminal styling from the customized Mocha Lavender theme, including accent colors on hovered, focused, and selected controls. It adjusts foreground colors where needed for contrast and uses the original palette swatches for filled controls.

With Node.js 20 or newer, regenerate and verify the theme files.

```sh
node scripts/generate.mjs
node scripts/generate.mjs --check
node --test
```

Update the four Lavender screenshots under `assets/` at the same dimensions, then rebuild the cover with [Catwalk](https://github.com/catppuccin/catwalk).

```sh
catwalk --directory assets --output preview.webp
```

The GitHub repository is `catppuccin-t3-code`. It uses `main` as its default branch and the topics `catppuccin`, `theme`, and `t3-code`. [Catppuccin port guidelines](https://github.com/catppuccin/catppuccin/blob/main/docs/port-creation.md)

## Thanks to

- [ncn1issad](https://github.com/ncn1issad) for the customized Mocha Lavender design.
- [jainvaibhav671](https://github.com/jainvaibhav671) for the original [Catppuccin Mocha theme in T3 Themes](https://t3themes.com/themes/catppuccin-mocha/).
- [Catppuccin](https://github.com/catppuccin) for the palettes and port tools.

[MIT License](LICENSE)
