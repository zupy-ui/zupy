# Themes and tokens

How to add a theme, or a new token to every theme. For using themes in an app, see the public Theming page in the docs site.

## Where things live

| File | Holds |
| --- | --- |
| `packages/tokens/src/types.ts` | The shape of a theme: color roles (`ColorRole`) and `Shape` |
| `packages/tokens/src/themes.ts` | The themes: `pop` (default), `arcade`, `gloss` |
| `packages/tokens/src/motion.ts` | Easings, durations and fonts shared by all themes |
| `packages/tokens/src/css.ts` | Turns themes into CSS (`toCss`) and the Tailwind mapping (`toTailwindTheme`) |
| `packages/tokens/scripts/build-css.ts` | Writes `dist/tokens.css` and `dist/theme.css` |

## Adding a theme

1. In `themes.ts`, add a `Theme` with a `name`, a `light` and `dark` palette, and a `shape`. Reuse the shared `radius` and `depth` objects unless the theme needs different ones.
2. Add it to the `themes` export. The first theme in that object is the default on `:root`, so keep `pop` first.
3. Rebuild: `bun run --cwd packages/tokens build`.
4. It's now selectable with `data-theme="<name>"`.
5. Add a one-line description to `themeBlurb` in `apps/www/src/routes/index.tsx` so it shows in the landing page's theme picker (TypeScript will remind you).

Check every fill against its `-foreground` for contrast in both modes. In borderless themes (`edgeWidth: "0px"`), the shadow still uses `edge`, so pick an edge color that reads as a shadow.

## Adding a color role

1. Add the name to `ColorRole` in `types.ts`. TypeScript will then flag every theme that's missing it.
2. Fill in a value for `light` and `dark` in each theme.
3. Rebuild tokens. `--zupy-<name>` and the Tailwind color `<name>` (e.g. `bg-<name>`) are generated automatically.

If it's a fill, add a matching `<name>-foreground` too.

## Adding a shape or motion token

- **Shape** (per theme): add the field to `Shape` in `types.ts`, set it in each theme, and add it to `shapeVars` in `css.ts`.
- **Motion or font** (shared): add it to `motion.ts`. Easings and fonts are mapped to Tailwind in `toTailwindTheme`; durations are used as raw variables (`duration-(--zupy-duration-fast)`).

## Selectors

Generated CSS works like this:

- `:root` and `[data-theme="pop"]` get the default theme.
- `[data-theme="<name>"]` gets that theme. Themes can be nested.
- `.dark` on the same element or an ancestor switches to the dark palette.

## After changing tokens

Rebuild tokens, then restart or refresh the docs. Tokens aren't aliased to source in dev, because their CSS is generated.
