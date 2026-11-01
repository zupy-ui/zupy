<p align="center">
  <img src="apps/www/public/logo.webp" width="96" height="96" alt="zupy" />
</p>

<h1 align="center">zupy</h1>

<p align="center">Tactile React components with chunky edges, hard shadows and springy motion.</p>

<p align="center"><a href="https://zupy-ui.github.io/zupy/"><strong>Documentation</strong></a></p>

## Install

```bash
bun add @zupy/ui @zupy/icons
```

```css
@import "tailwindcss";
@import "@zupy/ui/styles.css";
```

```tsx
import { Button } from "@zupy/ui";

<Button>Press me</Button>;
```

## Packages

| Package        | What it is                             |
| -------------- | -------------------------------------- |
| `@zupy/ui`     | React components, built on Base UI     |
| `@zupy/icons`  | Tactile SVG icons                      |
| `@zupy/tokens` | Themes as CSS variables and TypeScript |

## Development

```bash
bun install
bun run dev
```

The docs run at http://localhost:3000. Every push to `main` that touches the docs or a package redeploys https://zupy-ui.github.io/zupy/.

## License

[MIT](LICENSE)
