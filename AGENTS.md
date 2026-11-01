# AGENTS.md

Guide for coding agents working in this repo. Read it before making changes.

## What this is

zupy is a tactile React design system: chunky outlines, hard drop shadows, springy motion. Raised things sink into their shadow when pressed. React Native / Expo support is planned, so keep tokens platform-neutral.

## Deeper docs

| Doc                                                      | Read it when                                                           |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)             | You need to know how tokens, CSS, components and the docs site connect |
| [docs/design-language.md](docs/design-language.md)       | You're styling anything                                                |
| [docs/adding-a-component.md](docs/adding-a-component.md) | You're adding or changing a component                                  |
| [docs/icons.md](docs/icons.md)                           | You're drawing an icon                                                 |
| [docs/theming.md](docs/theming.md)                       | You're adding a theme or token                                         |

## Layout

```
apps/www          @zupy/www     landing + docs (TanStack Start, Fumadocs)
packages/ui       @zupy/ui      React components (Base UI + Tailwind v4 + cva)
packages/icons    @zupy/icons   tactile SVG icons + createIcon
packages/tokens   @zupy/tokens  themes in TypeScript → generated CSS variables
packages/config   @zupy/config  shared tsconfig presets
```

## Commands

```bash
bun install
bun run dev          # docs at http://localhost:3000
bun run build        # all packages + docs (turbo)
bun run typecheck
bun run lint         # biome check
bun run format       # biome check --write
```

Run a single package with `bun run --cwd packages/ui build`.

## Tooling rules

- **Bun** for everything. Add dependencies with `bun add` / `bun add -D` in the right workspace; never hand-write versions.
- **Biome** for lint and format. No ESLint or Prettier.
- **TypeScript 7**. Use the `@/*` alias for imports inside a package (`@/lib/cn`), never `../../`.
- Builds use **tsdown**. Package `exports` point at `dist/`.

## Design rules

- **Tokens first.** Use semantic Tailwind classes (`bg-primary`, `text-muted`, `border-edge`, `rounded-lg`). Never hardcode colors or box shadows.
- **The tactile look** comes from the utilities in `packages/ui/src/styles.css`:
  - `raised` outline + hard shadow
  - `filled` fill from `--zupy-fill` (glossy when the theme is)
  - `pressable` sinks on press
  - `depth-sm` smaller lift for compact controls (leaf elements only)
- **Primary** (`#005afd`, the logo blue) is the default highlight: selected states, icons, active nav. **Accent** (yellow) is a secondary option.
- Copy is generic. Don't describe zupy as "for games" or "for kids".
- Respect reduced motion. Never animate text color on something whose background snaps (it flashes unreadable).

## Writing a component

1. One file per component in `packages/ui/src/components/`, exported from `src/index.ts`.
2. Wrap a **Base UI** primitive when one exists. Otherwise use `useRender` so it takes a `render` prop like every other component.
3. Variants with **cva**, exported as `<name>Variants`. Merge classes with `cn`.
4. Shared focus and disabled styles live in `@/lib/styles` (`focusRing`, `disabledStyle`).
5. JSDoc on the component and on non-obvious props, with an `@example`. Agents and editors read these.
6. Add a docs page at `apps/www/content/docs/components/<name>.mdx` (preview, code, props table) and register the component in `apps/www/src/components/mdx.tsx`.

## Icons

Make icons with `createIcon` in `packages/icons/src/icons.tsx`: a 24×24 `body` path (filled, outlined, shadowed), optional `outside` strokes and `details`. Add each new icon to the `icons` map. Keep the body within about 3–21 so the shadow fits.

## Tokens

Themes live in `packages/tokens/src/themes.ts` (`pop` default, `arcade`, `gloss`). CSS is generated into `dist/` by `scripts/build-css.ts`, so **rebuild tokens after changing a theme**: `bun run --cwd packages/tokens build`.

## Docs site

- `apps/www/vite.config.ts` aliases `@zupy/ui` and `@zupy/icons` to their source for hot reload. Add new packages there too.
- The sidebar (`docs-sidebar.tsx`) and table of contents (`docs-toc.tsx`) are our own components inside Fumadocs' layout.
- Page icons come from frontmatter: `icon: HelloIcon` (zupy) or any Lucide name.
- `/llms.txt`, `/llms-full.txt` and `/docs/<page>.md` are generated. Keep them working.

## Before you finish

Run `bun run lint`, `bun run typecheck` and `bun run build`. For visual changes, check the page in light and dark mode.

## Commits

Single-line conventional messages with a scope, no body and no attribution trailers:

```
feat(ui): add tooltip
fix(www): stop sidebar label flash
chore: bump deps
```

Scopes: `ui`, `icons`, `tokens`, `www`, `config`, or none for repo-wide changes.
