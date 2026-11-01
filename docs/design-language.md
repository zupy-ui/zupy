# Design language

zupy should feel physical. Things look like objects you can press, and they respond when you do.

## The tactile look

Every raised element is built from four ingredients:

| Ingredient | Token                              | Default (`pop`) | Notes                                                    |
| ---------- | ---------------------------------- | --------------- | -------------------------------------------------------- |
| Outline    | `--zupy-edge-width`, `--zupy-edge` | `2px`, ink      | `0px` gives a borderless look (`gloss`)                  |
| Lift       | `--zupy-lift`                      | `4px`           | A hard shadow, no blur, in the edge color                |
| Press      | `--zupy-press`                     | `3px`           | How far it sinks on press; keep it below lift            |
| Gloss      | `--zupy-gloss`                     | `0`             | `1` adds a top highlight, bottom shade and gradient fill |

Use the utilities instead of writing shadows by hand:

```tsx
<div className="raised filled pressable rounded-lg [--zupy-fill:var(--zupy-primary)]" />;
```

- `raised`: outline + hard shadow
- `filled`: background from `--zupy-fill`
- `pressable`: sinks into its shadow while pressed (and when `data-pressed` is set)
- `depth-sm`: smaller lift and press for compact controls like checkboxes. Put it on leaf elements only, because the override inherits.

Not everything should be raised. Inputs and tracks are **sunken** (soft border, slight inner shadow). Containers inside a raised card are **flat**. Too many raised layers turn into noise.

## Color

| Role                           | Use for                                                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `primary`                      | The default highlight: main actions, selected states, active navigation, icons. It's the logo blue (`#005afd`). |
| `accent`                       | A second highlight (yellow) when you need contrast with primary. Never the default.                             |
| `success`, `warning`, `danger` | Status only                                                                                                     |
| `surface`                      | Tints, tracks, hovers                                                                                           |
| `card`                         | Cards, inputs, secondary buttons                                                                                |
| `muted`                        | Secondary text                                                                                                  |
| `edge`                         | Outlines and hard shadows                                                                                       |

Every fill has a `-foreground` partner for text on top of it. Always pair them.

## Shape

Radii come from `--zupy-radius-sm` to `-xl`. Bigger elements get bigger radii. Pills (`rounded-full`) are for badges and switches. The logo is a squircle (superellipse); use the image instead of approximating it with CSS.

## Type

- **Fredoka** (`font-display`): headings, buttons, labels, anything you'd tap.
- **Inter** (`font-sans`): body text.
- Headings are bold with slightly tight tracking.

## Motion

| Token                           | Use                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `ease-pop`                      | Entrances and toggles that should overshoot a little (checkbox tick, switch thumb) |
| `ease-snap`                     | Movement that should settle without bounce                                         |
| `--zupy-duration-press` (80ms)  | Press feedback                                                                     |
| `--zupy-duration-fast` (140ms)  | Hovers                                                                             |
| `--zupy-duration-base` / `slow` | Larger movement                                                                    |

Rules:

- Respect `prefers-reduced-motion`. The shared utilities and animations already do.
- **Never animate text color on an element whose background snaps.** The text passes through an unreadable color for a moment. Animate only the background, or nothing.
- Celebrate sparingly: `animate-pop` on something new, `animate-shake` on errors.

## Copy

- Keep it generic. zupy is for any playful app, so don't describe it as for games, kids or quizzes.
- Short, plain sentences. Examples use everyday content ("Weekly goal", "Display name").

## Accessibility

- Build on Base UI so keyboard and screen reader behavior come for free.
- Every interactive element uses `focusRing` from `@/lib/styles`.
- Icon-only buttons require `aria-label`. Icons are decorative unless given a `title`.
- Check text contrast on every fill in light and dark mode.
