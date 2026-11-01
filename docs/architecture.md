# Architecture

How the packages fit together, from a color value to a pixel on the docs site.

## The pipeline

```
packages/tokens   themes.ts ──► build-css.ts ──► dist/tokens.css   (--zupy-* variables)
                                             └─► dist/theme.css    (Tailwind @theme inline)
                        │
packages/ui       styles.css ── imports both, adds utilities (raised, filled, pressable, depth-sm)
                  components ── Tailwind classes that read those tokens and utilities
                        │
packages/icons    createIcon ── reads the same --zupy-* variables, with fallbacks
                        │
apps/www          app.css ───── imports tailwindcss + @zupy/ui/styles.css
                  docs + landing page use the components
```

### 1. Tokens (`packages/tokens`)

- `src/themes.ts` defines each theme (`pop`, `arcade`, `gloss`) as plain TypeScript: a light palette, a dark palette and a shape (outline width, lift, press, gloss, radii).
- `src/motion.ts` holds easings, durations and font stacks shared by every theme.
- `scripts/build-css.ts` runs `toCss()` and `toTailwindTheme()` from `src/css.ts` and writes:
  - `dist/tokens.css`: `--zupy-*` custom properties per theme, selected with `data-theme` and `.dark`
  - `dist/theme.css`: an `@theme inline` block mapping Tailwind names (`bg-primary`, `rounded-lg`, `ease-pop`) to those variables

Because themes are TypeScript, React Native can import the same values later without parsing CSS.

### 2. Components (`packages/ui`)

- `src/styles.css` is the single CSS entry consumers import. It pulls in both token files, tells Tailwind to scan the package (`@source "."`) and defines the tactile utilities and keyframes.
- Each component wraps a Base UI primitive (or uses `useRender`) and styles it with cva variants that only use semantic classes.
- `@theme inline` matters: utilities point straight at `var(--zupy-*)`, so a nested `data-theme` restyles everything inside it.

### 3. Icons (`packages/icons`)

Icons are plain SVG built by `createIcon`. They read `--zupy-icon-fill`, `--zupy-icon-ink` and `--zupy-icon-outline`, falling back to the theme's primary colors and finally to hex values, so they also work without zupy's CSS.

### 4. Docs site (`apps/www`)

- TanStack Start with Fumadocs (`fumadocs-core`, `fumadocs-mdx`, and `fumadocs-ui` for the page layout).
- MDX content lives in `content/docs`. Components available inside MDX are registered in `src/components/mdx.tsx`.
- The sidebar (`docs-sidebar.tsx`), table of contents (`docs-toc.tsx`) and theme switch are our own zupy components dropped into Fumadocs' layout slots. Fumadocs' remaining colors are mapped to zupy tokens in `src/styles/app.css`.
- `src/lib/source.ts` resolves frontmatter `icon:` names to zupy icons first, then Lucide.
- The site prerenders every page, plus `/llms.txt`, `/llms-full.txt` and a Markdown version of each page.

## Dev vs build

Package `exports` point at `dist/`. In dev, `apps/www/vite.config.ts` aliases `@zupy/ui`, `@zupy/ui/styles.css` and `@zupy/icons` to their `src/` so edits hot-reload.

Tokens are **not** aliased, because their CSS is generated. After changing a theme, run `bun run --cwd packages/tokens build`.

`turbo` makes `dev`, `build` and `typecheck` depend on `^build`, so packages are built before the docs use them.

## Why these choices

| Choice | Reason |
| --- | --- |
| Base UI | Accessible, unstyled primitives with a `render` prop for composition |
| Tailwind v4 + CSS variables | Themes are just variables; no config needed in the consuming app |
| cva | Typed variants that agents and editors understand |
| Tokens in TypeScript | One source for web CSS now and React Native later |
| Separate icons package | Icons work without the components, and stay tree-shakable |
