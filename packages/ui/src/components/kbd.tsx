import { useRender } from "@base-ui/react/use-render";
import { cn } from "@/lib/cn";

export interface KbdProps extends useRender.ComponentProps<"kbd"> {}

/**
 * A keyboard key, for shortcuts and hints.
 *
 * @example
 * Press <Kbd>Space</Kbd> to jump
 */
export function Kbd({ className, render, ...props }: KbdProps) {
	return useRender({
		render,
		defaultTagName: "kbd",
		props: {
			className: cn(
				"raised filled depth-sm inline-flex h-6 min-w-6 items-center justify-center rounded-sm px-1.5",
				"font-mono font-semibold text-foreground text-xs [--zupy-fill:var(--zupy-card)]",
				className,
			),
			...props,
		},
	});
}
