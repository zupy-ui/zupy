# Adding a component

A checklist for adding a component to `@zupy/ui`. Follow existing components (`button.tsx`, `switch.tsx`, `card.tsx`) when in doubt.

## 1. Pick the base

- If [Base UI](https://base-ui.com) has the primitive (dialog, menu, tooltip, slider…), wrap it. You get keyboard support, focus handling and ARIA for free.
- If it's purely visual (card, badge), render with `useRender` from `@base-ui/react/use-render` so it still takes a `render` prop.

Check the primitive's types in `node_modules/@base-ui/react/<name>/` for its parts, props and `data-*` attributes before styling.

## 2. Write the file

Create `packages/ui/src/components/<name>.tsx`. One component (or one family of parts) per file.

### Template: wrapping Base UI

```tsx
import { Thing as BaseThing } from "@base-ui/react/thing";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { disabledStyle, focusRing } from "@/lib/styles";

export const thingVariants = cva(
	["raised filled pressable rounded-lg", focusRing, disabledStyle],
	{
		variants: {
			size: { sm: "h-9 px-3", md: "h-11 px-4" },
		},
		defaultVariants: { size: "md" },
	},
);

export interface ThingProps
	extends Omit<BaseThing.Props, "className">,
		VariantProps<typeof thingVariants> {
	className?: string;
}

/**
 * One sentence on what it is.
 *
 * @example
 * <Thing size="sm">Hello</Thing>
 */
export function Thing({ size, className, ...props }: ThingProps) {
	return (
		<BaseThing className={cn(thingVariants({ size }), className)} {...props} />
	);
}
```

### Template: visual only

```tsx
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/cn";

export interface ThingProps extends useRender.ComponentProps<"div"> {}

export function Thing({ className, render, ...props }: ThingProps) {
	return useRender({
		render,
		defaultTagName: "div",
		props: { className: cn("rounded-xl bg-card", className), ...props },
	});
}
```

### Rules

- Only semantic classes and zupy utilities. No hex colors or hand-written shadows.
- Style states with Base UI's data attributes (`data-checked:`, `data-pressed:`, `data-disabled:`), not extra props.
- `className` is a plain string. Base UI accepts a function there; we omit that from our props so `cn` can merge.
- Export variants as `<name>Variants` so others can style their own elements to match.
- If a custom `render` is usually not the native element (like a link inside `Button`), handle that, as `Button` does with `nativeButton`.
- Use `primary` for selected and active states (see [design language](design-language.md)).

## 3. Export it

Add the component, its props type and its variants to `packages/ui/src/index.ts`.

## 4. Document it

1. Create `apps/www/content/docs/components/<name>.mdx`:

   ````mdx
   ---
   title: Thing
   description: One sentence, same as the JSDoc.
   ---

   <Preview>
     <Thing>Hello</Thing>
   </Preview>

   ```tsx
   import { Thing } from "@zupy/ui";

   <Thing>Hello</Thing>
   ```

   ## Props

   | Prop | Type | Default |
   | ---- | ---- | ------- |
   ````

2. Register it in `apps/www/src/components/mdx.tsx` so the preview can render it.
3. The sidebar picks the page up automatically from the `components/` folder.

## 5. Check it

```bash
bun run lint
bun run typecheck
bun run build
```

Then open the docs page and check:

- light and dark mode
- the `arcade` and `gloss` themes (no outline, glossy fills)
- keyboard focus and disabled states
- press feedback, and that nothing flashes when state changes

## 6. Commit

```
feat(ui): add thing
docs(www): add thing docs
```
