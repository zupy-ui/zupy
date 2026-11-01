# Drawing icons

zupy icons look like tiny raised tiles: a filled shape with a thick outline and a hard shadow underneath. They live in `packages/icons/src/icons.tsx` and are built with `createIcon`.

## Anatomy

```
         outside   strokes beyond the shape (antenna, handle, arrow), in the outline color
         details   marks on the shape (eyes, dots, lines), in the ink color
┌──────┐ body      the main shape: primary fill + 2px outline
└──────┘ shadow    the same body, shifted 1.75px down, in the edge color (automatic)
```

| Layer | Color variable | Default |
| --- | --- | --- |
| body fill | `--zupy-icon-fill` | `--zupy-primary` |
| outline + `outside` | `--zupy-icon-outline` | `--zupy-foreground` |
| `details` | `--zupy-icon-ink` | `--zupy-primary-foreground` |
| shadow | `--zupy-edge` | ink |

Two inks keep every part readable: in dark mode the outline is light, so strokes outside the body stay visible against the background, while details on the blue body stay white.

## Grid

- Draw on a **24×24** grid. Strokes are 2px with round caps and joins.
- Keep the body within roughly **3–21** on both axes, leaving the bottom ~2px free for the shadow.
- Use one closed path for the body. Several sub-paths in one `d` string are fine (e.g. a head and shoulders).
- Prefer fat, rounded shapes. Avoid thin parts that disappear at 16px.

## Writing one

```tsx
export const CloudIcon = createIcon("CloudIcon", {
	body: "M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z",
	outside: <path d="M12 2.5v2" />,
	details: (
		<>
			<circle cx="10" cy="13" r="1.1" {...dot} />
			<circle cx="14" cy="13" r="1.1" {...dot} />
		</>
	),
});
```

- `dot` is a helper for filled circles (no stroke).
- Add a JSDoc line saying what it shows and when to use it.
- Name it `<Thing>Icon` in PascalCase.

## Then

1. Add it to the `icons` map at the bottom of `icons.tsx`, and to the exports in `src/index.ts`.
2. It shows up automatically in the gallery on the docs Icons page.
3. Check it at 16px, 20px and 40px, in light and dark mode, and on the blue active sidebar row (where it flips to a white body with blue details).

## Using icons as page icons

Docs pages pick an icon in frontmatter by export name:

```yaml
icon: RobotIcon
```
